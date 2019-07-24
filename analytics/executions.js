console.log("-----------------");

const events = require('./events.json').filter(e => !e.payload || !e.payload.repository || !e.payload.repository.clone_url_http || !e.payload.repository.clone_url_http.includes("dojos"));
console.log('events:', events.length);

const ev = (uuid) => events.find(e => e.uuid === uuid);
const ets = (event_type) => events.filter(e => e.event_type === event_type);

const prcs = ets(`PullRequestCreated`);

const log = x => console.log(JSON.stringify(x, null, '  '));

console.log(JSON.stringify(prcs[0], null, '  '));

const prcStatus = (prc) => {
    //console.log(prc.payload.repository.clone_url_http)
    //console.log(JSON.stringify(prc, null, ' '));
    //log(events.filter(e => e.event_type === `PullRequestUpdated` && e.payload.pr_id === prc.payload.pr_id))
    let prus = events.filter(e => e.event_type === `PullRequestUpdated` && e.payload.pr_id === prc.payload.pr_id && e.payload.repository.clone_url_http === prc.payload.repository.clone_url_http);
    if (!prus.length) return "UNKNOWN";
    return prus[prus.length-1].payload.status;
};

let prs = prcs.map(prc => ({prc_uuid: prc.uuid, prr_uuid: prc.payload.parent.uuid, status: prcStatus(prc) }));

log(prs.slice(0, 55));

if (Date.now() !== 1) return;




const ticForPr = (pr) => ev(pr.PullRequestRequested).payload.parent.uuid;
const tirForPr = (pr) => { const tic = ticForPr(pr); return ev(tic).payload.parent.uuid; }
const toolIdForPr = (pr) => { const tir = tirForPr(pr); return ev(tir).payload.tool_id; }

const prz = {};

const xprs = require('./prs.json').filter(pr => !pr.pr_url.includes("dojos"));
xprs.forEach(pr => {
    const toolId = toolIdForPr(pr);
    prz[toolId] = prz[toolId] || {merged: 0, closed: 0};
    prz[toolId][pr.status]++;
});

const tirs = events.filter(e => e.event_type === 'ToolInvocationRequested' && !e.payload.repository.full_path.includes("dojos"));

const executions = {};
tirs.forEach(tir => {
    executions[tir.payload.tool_id] = executions[tir.payload.tool_id] || 0;
    executions[tir.payload.tool_id]++;
});
const toolIdsEverExecuted = [... new Set(tirs.map(tir => tir.payload.tool_id))];

function toPercent(value, total) {
    return total ? `${value} (${(value/total * 100).toFixed(0)}\\%)` : '-';
}

//pretty(executions);

let toolIds = Object.keys(executions);
toolIds.sort();
toolIds = toolIds.filter(tid => tid[0] === 'w').concat(toolIds.filter(tid => tid[0] !== 'w'));
toolIds = toolIds.filter(tid => tid[0] !== 'w');

const totais = {executions: 0, prs: 0, merged: 0, closed: 0};
const outras = {executions: 0, prs: 0, merged: 0, closed: 0};
toolIds.forEach(toolId => {
    const prsForTool = prz[toolId] || {merged: 0, closed: 0};
    const merged = prsForTool.merged, closed = prsForTool.closed, total = merged + closed;

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
            `${toolId} & ${executions[toolId]} & ${total} & ${mergedVal} & ${closedVal} \\\\ \\hline`
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