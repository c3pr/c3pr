require("node-c3pr-logger").log.testMode();
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const sinon = require('sinon');
require('chai').should();

const request = require('request');
const RESPONSE_OK = {statusCode: 200, headers: {'content-type': 'application/json'}};

const invokeTools = require('./invokeTools');
const config = require('../config');
require("node-c3pr-logger").log.testMode();

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
    const toolAgents = {
        agents: [
            {name: "one", extensions: ["java", "js"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}},
            {name: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}}
        ]
    };


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
        this.post = sinon.stub(request, 'post');
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
        request.post.restore();
    });

    it('should issue a post to each tool with extensions on changeset files', () => {
        this.post.yields(null, RESPONSE_OK, JSON.stringify(responseBody));

        invokeTools(toolAgents, changes);

        sinon.assert.calledTwice(this.post);

        const firstCallFirstArgument = this.post.getCall(0).args[0];
        expect(firstCallFirstArgument).to.deep.equal({
            url: toolAgents.agents[0].agentURL,
            json: true,
            body: {
                meta: {
                    compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
                    correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
                    dates: [{date: "2018-02-12T14:05:08.893Z", node: "c3pr-repo-github", schema: "changes"}, {date: now.toISOString(), node: "c3pr", schema: "toolInvocation"}]
                },
                c3pr: {
                    prsUrl: "http://c3pr-github.herokuapp.com/prs",
                    patchesUrl: "http://changes-server/patches"
                },
                repository: changes.repository,
                files: [changes.changeset[0], changes.changeset[1]],
                tool: toolAgents.agents[0]
            }
        });

        const secondCallFirstArgument = this.post.getCall(1).args[0];
        expect(secondCallFirstArgument).to.deep.equal({
            url: toolAgents.agents[1].agentURL,
            json: true,
            body: {
                meta: {
                    compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
                    correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
                    dates: [{date: "2018-02-12T14:05:08.893Z", node: "c3pr-repo-github", schema: "changes"}, {date: now.toISOString(), node: "c3pr", schema: "toolInvocation"}]
                },
                c3pr: {
                    prsUrl: "http://c3pr-github.herokuapp.com/prs",
                    patchesUrl: "http://changes-server/patches"
                },
                repository: changes.repository,
                files: [changes.changeset[1]],
                tool: toolAgents.agents[1]
            }
        });
    });

});

