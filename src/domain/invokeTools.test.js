require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').should();


const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

const toolAgents = require('../toolAgents');

const invokeTools = require('./invokeTools');
const config = require('../config');
require("node-c3pr-logger").testMode();

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

    toolAgents.agents = [
        {toolId: "one", extensions: ["java", "js"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}, prTitle: "prTitle one", prBody: `prBody one`},
        {toolId: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}, prTitle: "prTitle two", prBody: `prBody two`},
    ];
    for (let i = 0; i < 100; i++) { // add many times the tool 'one', because the tool array will be shuffled. This guaranties most of the time, the 'two' will not be first
        toolAgents.agents.push(toolAgents.agents[0]);
    }

    let responseBody;
    const now = new Date();
    let sandbox, clock;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock = sinon.useFakeTimers(now.getTime());

        config.c3pr.patchesUrl = 'http://changes-server/patches';

        responseBody = {
            that: 'is it!'
        };
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it('should issue a post to each tool with extensions on changeset files', async () => {

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

        mock.onPost(toolAgents.agents[0].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[0], changes.changeset[1]],
            tool: toolAgents.agents[0]
        }).reply(204, {}, {'content-type': 'application/json'}); // calls on tool 'one' never produce diff

        mock.onPost(toolAgents.agents[1].agentURL, {
            meta, c3pr, repository,
            files: [changes.changeset[1]],
            tool: toolAgents.agents[1]
        }).reply(200, {}, {'content-type': 'application/json'}); // calls on tool 'two' produces diff

        // execute
        let toolsApplied = await invokeTools(changes);

        // verify
        expect(toolsApplied.pop()).to.deep.equal({ toolId: 'two', diff: true }); // should aways stop on 'two'
        // notice 1% of the time the array below will be empty (when tool 'two' has been shuffled into 1st position)
        toolsApplied.forEach(o => {
            expect(o).to.deep.equal({ toolId: 'one', diff: false });
        });
    });

});

