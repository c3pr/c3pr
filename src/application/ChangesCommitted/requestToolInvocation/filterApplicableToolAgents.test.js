process.env.NODE_ENV = 'test';

const filterApplicableToolAgents = require('./filterApplicableToolAgents');
const expect = require('chai').expect;


describe('applicableToolAgents', () => {

    const changes = {
        meta: {
            // ...
            compatibleSchemas: ["c3pr/c3pr::changes"]
            // ...
        },
        changeset: ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/x.xml']
        // ...
    };
    const toolAgents = {
        agents: [
            {name: "one", extensions: ["java", "xml"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}},
            {name: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}},
            {name: "three", extensions: ["txt"], agentURL: "http://three", command: "three command", toolMeta: {rule: "three"}},
        ]
    };

    it('applicableToolAgents', () => {

        const applicableToolAgents = filterApplicableToolAgents(toolAgents, changes);
        expect(applicableToolAgents).to.deep.equal([toolAgents.agents[0], toolAgents.agents[1]]);

    });

});

