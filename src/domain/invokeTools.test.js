process.env.NODE_ENV = 'test';

const invokeTools = require('./invokeTools');
const sinon = require('sinon');
require('chai').should();
const request = require('request');
const RESPONSE_OK = {statusCode: 200, headers: {'content-type': 'application/json'}};


describe('invokeTools', () => {

    const pushedChange = {
        meta: {
            correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a",
            compatibleSchemas: ["c3pr/c3pr::changes"]
        },
        changeset: ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js'],
        repository: {
            type: "git",
            url: "https://github.com/org/repo.git",
            revision: "4444eedacc076e8a16ae565b535fd48edb9a044a"
        }
    };
    const toolAgents = {
        agents: [
            {name: "one", extensions: ["java"], agentURL: "http://one", command: "one command", toolMeta: {rule: "one"}},
            {name: "two", extensions: ["js"], agentURL: "http://two", command: "two command", toolMeta: {rule: "two"}}
        ]
    };


    let responseBody;
    beforeEach(() => {
        responseBody = {
            that: 'is it!'
        };
        this.post = sinon.stub(request, 'post');
    });

    afterEach(() => {
        request.post.restore();
    });

    it('should issue a post to each tool with extensions on changeset files', () => {
        this.post.yields(null, RESPONSE_OK, JSON.stringify(responseBody));

        invokeTools(toolAgents, pushedChange);

        sinon.assert.calledTwice(this.post);

        sinon.assert.calledWith(this.post,
            {
                url: toolAgents.agents[0].agentURL,
                json: true,
                body: {
                    meta: {
                        compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
                        correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a"
                    },
                    repository: pushedChange.repository,
                    files: [pushedChange.changeset[0]],
                    tool: {
                        command: toolAgents.agents[0].command,
                        toolMeta: toolAgents.agents[0].toolMeta,
                    }
                }
            }
        );

        sinon.assert.calledWith(this.post,
            {
                url: toolAgents.agents[1].agentURL,
                json: true,
                body: {
                    meta: {
                        compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
                        correlationId: "4444eedacc076e8a16ae565b535fd48edb9a044a"
                    },
                    repository: pushedChange.repository,
                    files: [pushedChange.changeset[1]],
                    tool: {
                        command: toolAgents.agents[1].command,
                        toolMeta: toolAgents.agents[1].toolMeta,
                    }
                }
            }
        );
    });

});

