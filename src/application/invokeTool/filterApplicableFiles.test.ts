process.env.NODE_ENV = 'test';

import filterApplicableFiles from './filterApplicableFiles';
import {expect} from 'chai';


describe('filterApplicableFiles', () => {

    const toolName = 'my_tool';
    const changedFiles = [{
        file_path: "src/f1.js",
        changed_line_intervals: [{start: 99, end: 100}, {start: 150, end: 165}]
    }, {
        file_path: "src/f2.js",
        changed_line_intervals: [{start: 99, end: 100}, {start: 150, end: 165}]
    }, {
        file_path: "src/f3.js",
        changed_line_intervals: [{start: 99, end: 100}, {start: 150, end: 165}]
    }];

    it('all_tools:true should skip my_tool', () => {
        const projectFiles = [{file_path: "src/f1.js", excluded_for_tools: [{all_tools: true, all_lines: true}]}];

        const applicableFiles = filterApplicableFiles(toolName, changedFiles, projectFiles);

        expect(applicableFiles).to.deep.equal(["src/f2.js", "src/f3.js"]);
    });

    it('tool_name:my_tool should skip my_tool', () => {
        const projectFiles = [{file_path: "src/f2.js", excluded_for_tools: [{tool_name: "my_tool", all_lines: true}]}];

        const applicableFiles = filterApplicableFiles(toolName, changedFiles, projectFiles);

        expect(applicableFiles).to.deep.equal(["src/f1.js", "src/f3.js"]);
    });

    it('tool_name:other_tool should NOT skip my_tool', () => {
        const projectFiles = [{file_path: "src/f3.js", excluded_for_tools: [{tool_name: "other_tool", all_lines: true}]}];

        const applicableFiles = filterApplicableFiles(toolName, changedFiles, projectFiles);

        expect(applicableFiles).to.deep.equal(["src/f1.js", "src/f2.js", "src/f3.js"]);
    });

});

