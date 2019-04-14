process.env.NODE_ENV = 'test';

const filterApplicableToolAgents = require('./filterApplicableToolAgents');
import { expect } from 'chai';


describe('applicableToolAgents', () => {

    const toolAgents = [
        {name: "one", extensions: ["java", "xml"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}},
        {name: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}},
        {name: "three", extensions: ["txt"], agentURL: "http://three", command: "three command", toolMeta: {rule: "three"}},
    ];
    const files = ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/x.xml'];

    it('applicableToolAgents', () => {

        const applicableToolAgents = filterApplicableToolAgents(toolAgents, files);
        expect(applicableToolAgents).to.deep.equal([toolAgents[0], toolAgents[1]]);

    });

});

