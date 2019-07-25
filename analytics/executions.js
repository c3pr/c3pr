console.log("-----------------");

const events = require(process.env.LOCATION + '/events.json').filter(e => !e.payload || !e.payload.repository || !e.payload.repository.clone_url_http || !e.payload.repository.clone_url_http.includes("dojos"));
console.log('events:', events.length);

const ev = (uuid) => events.find(e => e.uuid === uuid);
const ets = (event_type) => events.filter(e => e.event_type === event_type);

const prcs = ets(`PullRequestCreated`);

const log = x => console.log(JSON.stringify(x, null, '  '));


const xprs = require(process.env.LOCATION + '/prs.json').filter(pr => !pr.pr_url.includes("dojos"));
const xpurl = clone_url_http => xprs.find(xpr => xpr.pr_url.indexOf(clone_url_http.replace(/\.git$/,'')) === 0);
const xpr = pr_id => xprs.find(xpr => xpr.pr_id === pr_id);

const prcStatus = (prc) => {
    //console.log(prc.payload.repository.clone_url_http)
    //console.log(JSON.stringify(prc, null, ' '));
    //log(events.filter(e => e.event_type === `PullRequestUpdated` && e.payload.pr_id === prc.payload.pr_id))
    let prus = events.filter(e => e.event_type === `PullRequestUpdated` && e.payload.pr_id === prc.payload.pr_id && e.payload.repository.clone_url_http === prc.payload.repository.clone_url_http);
    const prStatus = (xpr(prc.payload.pr_id) || {}).status;

    if (!prus.length || prus[prus.length-1].payload.status !== prStatus) {
        console.log(`{repo: "${prc.payload.repository.full_path}", mr: ${prc.payload.pr_id}},`);
    }

    return (prus[prus.length-1] || {payload: {status: 'unk'}}).payload.status;
};

let prs = prcs.map(prc => ({prc_uuid: prc.uuid, prr_uuid: prc.payload.parent.uuid, status: prcStatus(prc) }));

//log(prs.slice(0, 55));

if (Date.now() !== 1) return;




const tirEventForPr = (prr_uuid) => { const tir = tirForPr(prr_uuid); return ev(tir); }
const tirForPr = (prr_uuid) => { const tic = ticForPr(prr_uuid); return ev(tic).payload.parent.uuid; }
const ticForPr = (prr_uuid) => ev(prr_uuid).payload.parent.uuid;
const ticEventForPr = (prr_uuid) => { const tic = ticForPr(prr_uuid); return ev(tic); }

const prz = {};

prs.forEach(({prc_uuid, prr_uuid, status}) => {
    const toolId = tirEventForPr(prr_uuid).payload.tool_id;
    prz[toolId] = prz[toolId] || {merged: 0, closed: 0, unk: 0};
    prz[toolId][status] += ticEventForPr(prr_uuid).payload.changed_files.length;
});

const tirs = events.filter(e => e.event_type === 'ToolInvocationRequested' && !e.payload.repository.full_path.includes("dojos"));

const executions = {};
tirs.forEach(tir => {
    executions[tir.payload.tool_id] = executions[tir.payload.tool_id] || 0;
    executions[tir.payload.tool_id] += tir.payload.files.length;
});
const toolIdsEverExecuted = [... new Set(tirs.map(tir => tir.payload.tool_id))];

function toPercent(value, total) {
    return total ? `${value} (${(value/total * 100).toFixed(0)}\\%)` : '-';
}

//pretty(executions);

let toolIds = Object.keys(executions);
toolIds.sort();
toolIds = toolIds.filter(tid => tid[0] === 'w').concat(toolIds.filter(tid => tid[0] !== 'w'));
// toolIds = toolIds.filter(tid => tid[0] !== 'w');

const namePad = toolIds.reduce((prev, curr) => Math.max(prev, curr.length), 0);
const pads = {
    exe: toolIds.reduce((prev, curr) => Math.max(prev, (executions[curr]+'').length), 0),
    tot: 3,
    mer: '12 (100\\%)'.length,
    clo: '12 (100\\%)'.length
};
const p = (x, v) => (x+'').padStart(v, ' ');

const totais = {executions: 0, prs: 0, merged: 0, closed: 0};
const outras = {executions: 0, prs: 0, merged: 0, closed: 0};
toolIds.forEach(toolId => {
    const prsForTool = prz[toolId] || {merged: 0, closed: 0};
    const merged = prsForTool.merged, closed = prsForTool.closed, unk = prsForTool.unk, total = merged + closed;

    //if (executions[toolId] < 10) {
    if (total < 1 && executions[toolId] < 10) {
        outras.executions += Number(executions[toolId]);
        outras.prs += total;
        outras.merged += merged;
        outras.closed += closed;
    } else {
        const mergedVal = toPercent(merged, total);
        const closedVal = toPercent(closed, total);
        console.log(
            `${toolId.padEnd(namePad, ' ')} & ${p(executions[toolId], pads.exe)} & ${p(total, pads.tot)} & ${p(mergedVal, pads.mer)} & ${p(closedVal, pads.clo)} & ${p(unk, pads.clo)} \\\\ \\hline`
        );
    }
    totais.executions += Number(executions[toolId]);
    totais.prs += total;
    totais.merged += merged;
    totais.closed += closed;
});

console.log(
    `\\hline
\\texttt{Outras} & ${outras.executions} & ${outras.prs} & ${toPercent(outras.merged, outras.prs)} & ${toPercent(outras.closed, outras.prs)} \\\\ \\hline`
);

console.log(
    `\\hline
\\texttt{Totais} & ${totais.executions} & ${totais.prs} & ${toPercent(totais.merged, totais.prs)} & ${toPercent(totais.closed, totais.prs)} \\\\ \\hline`
);

function pretty(x) { console.log(JSON.stringify(x, null, '\t')) }
console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^');