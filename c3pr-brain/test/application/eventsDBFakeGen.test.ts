import * as fs from "fs";


function resolve(path, obj = self, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}


let events = require('X:/MSc-Tools/c3pr/c3pr-analytics/events.json');

let e2 = events.filter(e => {
    if (e.event_type.includes('Failed')) return false;
    const clone_url_http = resolve('payload.repository.clone_url_http', e);
    return clone_url_http === undefined || clone_url_http === 'http://git.example.com/essteeai/w00t.git';
});


let i = 97; // a
function ch() {
    let n = i++;
    let ret = '';
    if (n <= 97+25) {
        ret += String.fromCharCode(n);
    } else {
        const number = n-97-26;
        console.log({number});
        ret = 'x' + (number).toString(36)
    }
    console.log(ret);
    return ret;
}

let fileDict = {};
function work(fileName) {
    if (!fileDict[fileName]) {
        fileDict[fileName] = ch();
    }
    return fileDict[fileName];
}


const revs = {AA_NONE: []};
e2.forEach(e => {
    const rev = e.payload.repository && e.payload.repository.revision || e.payload['source-webhook'].object_attributes.source_branch.split('_')[0];

    revs[rev] = revs[rev] || {total: 0};
    revs[rev].total++;
    revs[rev][e.event_type] = (revs[rev][e.event_type] || 0) + 1;
});

Object.keys(revs).forEach(r => {
    if ((revs[r].PullRequestUpdated || 0) <= 1) delete revs[r];
    else if (revs[r].total <= 50) delete revs[r];
});
console.log(JSON.stringify(revs, null, '  '));


e2 = e2.filter(e => {
    const rev = e.payload.repository && e.payload.repository.revision || e.payload['source-webhook'].object_attributes.source_branch.split('_')[0];
    return rev === 'd6197ffc4c568e03f276ab57ffa94b1aba9c29d6';
});

e2.forEach(e => {
    delete e.payload['source-webhook'];
    delete e.payload['source_webhook'];
    if (e.payload.pr_title) e.payload.pr_title = "w0";
    if (e.payload.pr_body) e.payload.pr_body = "w1";
    if (e.payload.diff_base64) e.payload.diff_base64 = "w2";
    delete e._id;
    if (e.payload.repository) {
        delete e.payload.repository.push_user;
        delete e.payload.repository.full_path;
        delete e.payload.repository.branch;
    }
    delete e.payload.assignee;
    if (e.payload.files) e.payload.files = e.payload.files.map(work);
    if (e.payload.changed_files) e.payload.changed_files = e.payload.changed_files.map(work);
    if (e.payload.unmodified_files) e.payload.unmodified_files = e.payload.unmodified_files.map(work);
});


let data = JSON.stringify(e2, null, '\t');
data = data.replace(/http:\/\/git\.example\.com\/essteeai\/w00t\.git/g, 'http://git.foo/bar.git');
fs.writeFileSync("test/application/eventsDBFake.data.json", data);

describe('eventsDBFakeGen.test', () => {

});