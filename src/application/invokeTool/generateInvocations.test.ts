import {expect} from 'chai';
import {generateInvocations} from "./generateInvocations";

require('chai').should();


describe('generateInvocations', () => {

    it('create invocations', () => {

        const changed_files = ['src/f1.java', 'src/f2.js', 'src/f3.js'];

        const toolAgents = [
            {tool_id: "tool_one", extensions: ["java", "js"], tags: ["java", "js"]},
            {tool_id: "tool_two", extensions: ["java", "js"], tags: ["java", "js"]}
        ];

        const projectFilesPreferences = [
            {file_path: "src/f1.java", excluded_for_tools: [{tool_name: "tool_one", all_lines: true}]}
        ];

        // execute
        const invocations = generateInvocations(changed_files, toolAgents, projectFilesPreferences, () => {});

        // verify
        expect(invocations).to.deep.equal([
            {
                "files": [
                    "src/f2.js",
                    "src/f3.js"
                ],
                "tool_id": "tool_one"
            },
            {
                "files": [
                    "src/f1.java"
                ],
                "tool_id": "tool_two"
            }
        ]);
    });

});

