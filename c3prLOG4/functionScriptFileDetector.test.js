const mongodb = require('mongodb');
const expect = require('chai').expect;
const c3prLOG4 = require('./').default;

const functionScriptFileDetector = require('./functionScriptFileDetector').default;
const getCallerName = require('./functionScriptFileDetector').getCallerName;
const getServiceName = require('./functionScriptFileDetector').getServiceName;

const config = require('../src/config');

c3prLOG4.testMode();


const SAMPLE_STACKS = {
    "stack1": [
        'Error',
        '    at getFullStack (...)',
        '    at functionScriptFileDetector (...)',
        "    at Object.t.default (evalmachine.<anonymous>:1:1133923)",
        "    at t.default (evalmachine.<anonymous>:1:1134939)",
        "    at invokeToolAtGitRepo (evalmachine.<anonymous>:1:1310731)",
        "    at <anonymous>"
    ],
    "stack2": [
        'Error',
        '    at getFullStack (...)',
        '    at functionScriptFileDetector (...)',
        "    at handleToolInvocation (evalmachine.<anonymous>:1:1313227)",
        "    at handleFirstCollectedEvent (evalmachine.<anonymous>:1:1125520)",
        "    at Object.c3prSH3 (/opt/c3pr-fake/node_modules/node-git-client/src/c3prSH3.ts:26:13)",
        "    at <anonymous>",
        "    at process._tickCallback (internal/process/next_tick.js:188:7)"
    ],
    "stack3": [
        'Error',
        '    at getFullStack (...)',
        '    at functionScriptFileDetector (...)',
        "    at Object.c3prSH3 (/opt/c3pr-repo-gitlab/node_modules/node-git-client/src/c3prSH3.ts:26:13)",
        "    at Object.forkAndApplyPatch (/opt/c3pr-repo-gitlab/node_modules/node-c3pr-repo/forkAndApplyPatch/index.ts:39:18)",
        "    at <anonymous>"
    ]
};



describe('functionScriptFileDetector', () => {

    it('direct call', () => {
        function directCall() {
            return functionScriptFileDetector();
        }
        const out = directCall();
        delete out.stack;
        expect(out).to.deep.equal({
            service_name: 'node-c3pr-logger',
            caller_name: "directCall"
        });
    });

    it('second level call + level === 1', () => {
        function directCall() {
            return functionScriptFileDetector(1);
        }
        function secondLevelCall() {
            return directCall();
        }
        const out = secondLevelCall();
        delete out.stack;
        expect(out).to.deep.equal({
            service_name: 'node-c3pr-logger',
            caller_name: "secondLevelCall"
        });
    });

    it('second level call + level === 1', () => {
        function secondLevelCallArrow() {
            return (() => functionScriptFileDetector())();
        }
        const out = secondLevelCallArrow();
        delete out.stack;
        expect(out).to.deep.equal({
            service_name: 'node-c3pr-logger',
            caller_name: "secondLevelCallArrow"
        });
    });

    describe('getCallerName', () => {

        it('1', () => {
            const caller_name = getCallerName(SAMPLE_STACKS.stack1);
            expect(caller_name).to.deep.equal("invokeToolAtGitRepo");
        });

        it('2', () => {
            const caller_name = getCallerName(SAMPLE_STACKS.stack2);
            expect(caller_name).to.deep.equal("handleToolInvocation");
        });

        it('3', () => {
            const caller_name = getCallerName(SAMPLE_STACKS.stack3);
            expect(caller_name).to.deep.equal("Object.c3prSH3");
        });

    });

    describe('getServiceName', () => {

        it('1', () => {
            const service_name = getServiceName(SAMPLE_STACKS.stack1, '\\/');
            expect(service_name).to.deep.equal("evalmachine");
        });

        it('2', () => {
            const service_name = getServiceName(SAMPLE_STACKS.stack2, '\\/');
            expect(service_name).to.deep.equal("c3pr-fake");
        });

        it('3', () => {
            const service_name = getServiceName(SAMPLE_STACKS.stack3, '\\/');
            expect(service_name).to.deep.equal("c3pr-repo-gitlab");
        });

    });

});