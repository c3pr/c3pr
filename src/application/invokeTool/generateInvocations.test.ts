import {expect} from 'chai';
import {generateInvocations} from "./generateInvocations";

require('chai').should();

const fakeLOG = () => fakeLOG;

describe('generateInvocations', () => {

    it('tools are selected based on extension', () => {
        const projectPreferences = {open_prs: {}, per_file: {}, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: "tool:java", extensions: ["java"], tags: [], weight: 100},
            {tool_id: "tool:js", extensions: ["js"], tags: [], weight: 100}
        ];
        const changed_files = ['src/f1.java', 'src/f2.js', 'src/f3.ts'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ["src/f1.java"], tool_id: "tool:java"},
            {files: ["src/f2.js"], tool_id: "tool:js"}
            // no invocation for f3.ts due to no ts tool available
        ]);
    });

    it('lower weight gets priority', () => {
        const projectPreferences = {open_prs: {}, per_file: {}, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: "tool:js1", extensions: ["js"], tags: [], weight: 100},
            {tool_id: "tool:js2", extensions: ["js"], tags: [], weight: 98},
            {tool_id: "tool:js3", extensions: ["js"], tags: [], weight: 99},
        ];
        const changed_files = ['src/f1.js'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ["src/f1.js"], tool_id: "tool:js2"}
        ]);
    });

    it('tools already invoked are excluded', () => {
        const projectPreferences = {open_prs: {}, per_file: {}, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {'src/f1.js': ['tool:js1'], 'src/f2.js': ['tool:js1', 'tool:js2']};
        const toolAgents = [
            {tool_id: "tool:js1", extensions: ["js"], tags: [], weight: 98},
            {tool_id: "tool:js2", extensions: ["js"], tags: [], weight: 100},
        ];
        const changed_files = ['src/f1.js', 'src/f2.js'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ["src/f1.js"], tool_id: "tool:js2"}
        ]);
    });

    it('files with open PRs are excluded', () => {
        const projectPreferences = {open_prs: {'src/f1.js': [123], 'src/f2.js': []}, per_file: {}, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: "tool:js", extensions: ["js"], tags: [], weight: 100},
        ];
        const changed_files = ['src/f1.js', 'src/f2.js'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ["src/f2.js"], tool_id: "tool:js"}
        ]);
    });

    it('project_wide prefs are applied to all files', () => {
        const projectPreferences = {open_prs: {}, per_file: {}, project_wide: {
            'tool:js1': {enabled: false, weight_modification: 0},
            'tool:js3': {enabled: true, weight_modification: -10}
        }};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: 'tool:js1', extensions: ["js"], tags: [], weight: 50}, // will be disabled
            {tool_id: 'tool:js2', extensions: ["js"], tags: [], weight: 99},
            {tool_id: 'tool:js3', extensions: ["js"], tags: [], weight: 100}, // will have weight lowered
        ];
        const changed_files = ['src/f1.js'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ["src/f1.js"], tool_id: "tool:js3"}
        ]);
    });

    it('per_file prefs are applied each to specific files', () => {
        const projectPreferences = {open_prs: {}, per_file: {
            'src/f1.js': {'tool:js1': {enabled: false, weight_modification: 0}},
            'src/f3.js': {'tool:js1': {enabled: true, weight_modification: 2}}
        }, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: 'tool:js1', extensions: ["js"], tags: [], weight: 99}, // will be disabled for f1, remain enabled for f2 & f3, having weight worsened for f3
            {tool_id: 'tool:js2', extensions: ["js"], tags: [], weight: 100}
        ];
        const changed_files = ['src/f1.js', 'src/f2.js', 'src/f3.js'];

        // execute:
        const invocations = generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG);

        // verify:
        expect(invocations).to.deep.equal([
            {files: ['src/f1.js', 'src/f3.js'], tool_id: "tool:js2"},
            {files: ['src/f2.js'], tool_id: "tool:js1"},
        ]);
    });

    it('tools with same resulting weight are shuffled', () => {
        const projectPreferences = {open_prs: {}, per_file: {
            'src/f1.js': {
                'tool:js1': {enabled: true, weight_modification: -1},
                'tool:js3': {enabled: true, weight_modification: 1}
            },
        }, project_wide: {}};
        const toolsAlreadyInvokedPerFile = {};
        const toolAgents = [
            {tool_id: 'tool:js1', extensions: ["js"], tags: [], weight: 101},
            {tool_id: 'tool:js2', extensions: ["js"], tags: [], weight: 100},
            {tool_id: 'tool:js3', extensions: ["js"], tags: [], weight: 99}
        ];
        const changed_files = ['src/f1.js'];

        // execute:
        const invokedTools = {};
        for (let i = 0; i < 100; i++) {
            invokedTools[generateInvocations(projectPreferences, changed_files, toolAgents, toolsAlreadyInvokedPerFile, fakeLOG)[0].tool_id] = true;
        }

        // verify:
        expect(invokedTools).to.deep.equal({'tool:js1': true, 'tool:js2': true, 'tool:js3': true});
    });

});

