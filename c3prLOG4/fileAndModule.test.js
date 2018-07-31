const mongodb = require('mongodb');
const expect = require('chai').expect;
const c3prLOG4 = require('./').default;

const getServiceName = require('./fileAndModule').getServiceName;

const config = require('../src/config');

c3prLOG4.testMode();


const sep = '/';
const x = {
    "stack1": [
        "    at Object.t.default (evalmachine.<anonymous>:1:1133923)",
        "    at t.default (evalmachine.<anonymous>:1:1134939)",
        "    at invokeToolAtGitRepo (evalmachine.<anonymous>:1:1310731)",
        "    at <anonymous>"
    ],
    "stack2": [
        "    at handleToolInvocation (evalmachine.<anonymous>:1:1313227)",
        "    at handleFirstCollectedEvent (evalmachine.<anonymous>:1:1125520)",
        "    at <anonymous>",
        "    at process._tickCallback (internal/process/next_tick.js:188:7)"
    ],
    "stack3": [
        "    at Object.c3prSH3 (/opt/c3pr-repo-gitlab/node_modules/node-git-client/src/c3prSH3.ts:26:13)",
        "    at Object.forkAndApplyPatch (/opt/c3pr-repo-gitlab/node_modules/node-c3pr-repo/forkAndApplyPatch/index.ts:39:18)",
        "    at <anonymous>"
    ]
};



describe('fileAndModule', () => {

    it('getServiceName - evalmachine', () => {
        expect(getServiceName(x.stack1, '\\/')).to.equal("evalmachine");
    });

    it('getServiceName - evalmachine2', () => {
        expect(getServiceName(x.stack2, '\\/')).to.equal("evalmachine");
    });

    it('getServiceName - service name', () => {
        expect(getServiceName(x.stack3, '\\/')).to.equal("c3pr-repo-gitlab");
    });

});