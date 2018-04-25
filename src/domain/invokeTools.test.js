require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').should();

const decideApplicableToolAgents = require('./decideApplicableToolAgents');
decideApplicableToolAgents.__shuffleArray = a => a; // shuffleArray won't shuffle a thing

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const toolAgents = require('../toolAgents');

const config = require('../config');
config.c3pr.patchesUrl = 'http://changes-server/patches';

require("node-c3pr-logger").testMode();

const invokeTools = require('./invokeTools');

describe('invokeTools', () => {

    const changes = {
        meta: {
            correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
            compatibleSchemas: ["c3pr/c3pr::changes"],
            dates: [{node: "c3pr-repo-github", date: "2018-02-12T14:05:08.893Z", schema: "changes"}]
        },
        c3pr: {prsUrl: "http://c3pr-github.herokuapp.com/prs"},
        changeset: ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/boo.txt'],
        repository: {
            type: "git",
            url: "https://github.com/org/repo.git",
            branch: "my-branch-name",
            revision: "4444eedacc076e8a16ae565b535fd48edb9a044a"
        }
    };

    const now = new Date();
    let sandbox, clock;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock = sinon.useFakeTimers(now.getTime());
    });
    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it('should issue a post to each tool with extensions on changeset files', async () => {

        toolAgents.agents = [
            {toolId: "one", extensions: ["java", "js"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}, prTitle: "prTitle one", prBody: `prBody one`},
            {toolId: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}, prTitle: "prTitle two", prBody: `prBody two`},
        ];

        const meta = {
            compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
            correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
            dates: [{date: "2018-02-12T14:05:08.893Z", node: "c3pr-repo-github", schema: "changes"}, {date: now.toISOString(), node: "c3pr", schema: "toolInvocation"}]
        };
        const c3pr = {
            prsUrl: "http://c3pr-github.herokuapp.com/prs",
            patchesUrl: "http://changes-server/patches"
        };
        const repository = changes.repository;

        axiosMock.onPost(toolAgents.agents[0].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[0], changes.changeset[1]],
            tool: toolAgents.agents[0]
        }).reply(204, {}, {'content-type': 'application/json'}); // calls on tool 'one' never produce diff

        axiosMock.onPost(toolAgents.agents[1].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[1]],
            tool: toolAgents.agents[1]
        }).reply(200, {files: [changes.changeset[1]]}, {'content-type': 'application/json'}); // calls on tool 'two' produces diff

        // execute
        let toolsApplied = await invokeTools(changes);

        // verify
        expect(toolsApplied[0]).to.deep.equal({ toolId: 'one', diff: false, files: []});
        expect(toolsApplied[1]).to.deep.equal({ toolId: 'two', diff: true, files: [changes.changeset[1]]}); // should aways stop on 'two'
        expect(toolsApplied.length).to.equal(2);
    });

    it('should not send file forward if it was modified by previous tool invocation', async () => {

        toolAgents.agents = [
            {toolId: "one", extensions: ["java", "js"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}, prTitle: "prTitle one", prBody: `prBody one`},
            {toolId: "two", extensions: ["java", "js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}, prTitle: "prTitle two", prBody: `prBody two`},
        ];

        const meta = {
            compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
            correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
            dates: [{date: "2018-02-12T14:05:08.893Z", node: "c3pr-repo-github", schema: "changes"}, {date: now.toISOString(), node: "c3pr", schema: "toolInvocation"}]
        };
        const c3pr = {
            prsUrl: "http://c3pr-github.herokuapp.com/prs",
            patchesUrl: "http://changes-server/patches"
        };
        const repository = changes.repository;

        axiosMock.onPost(toolAgents.agents[0].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[0], changes.changeset[1]],
            tool: toolAgents.agents[0]
        }).reply(200, {files: [changes.changeset[0]]}, {'content-type': 'application/json'}); // calls on tool 'one' changes only one file, so the other tool can be invoked in the remaining one

        axiosMock.onPost(toolAgents.agents[1].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[1]],
            tool: toolAgents.agents[1]
        }).reply(200, {files: [changes.changeset[1]]}, {'content-type': 'application/json'}); // calls on tool 'two' changes the other file

        // execute
        let toolsApplied = await invokeTools(changes);

        // verify
        expect(toolsApplied[0]).to.deep.equal({ toolId: 'one', diff: true, files: [changes.changeset[0]]});
        expect(toolsApplied[1]).to.deep.equal({ toolId: 'two', diff: true, files: [changes.changeset[1]]});
        expect(toolsApplied.length).to.equal(2);
    });

});

