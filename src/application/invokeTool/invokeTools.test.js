require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
require('chai').should();

const decideApplicableToolAgents = require('./decideApplicableToolAgents');
decideApplicableToolAgents.__shuffleArray = a => a; // shuffleArray won't shuffle a thing

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const config = require('../../config');
config.c3pr.patchesUrl = 'http://changes-server/patches';

require("node-c3pr-logger").testMode();

const invokeTools = require('./invokeTools').c3prBrain.invokeTools;

function configureFetchAllToolAgents(agents) {
    axiosMock
        .onGet(config.c3pr.hub.registryUrl, {headers: {Authorization: `Bearer ${config.c3pr.jwt}`}})
        .reply(200, agents, {'content-type': 'application/json'});
}


describe('invokeTools', () => {

    it('should emit a ToolInvocationRequested for each file that have a tool available', async () => {

        const parent = {event_type: "ChangesCommitted", uuid: "uuid-12312-3123123-12312" };
        const changes = {
            repository: {
                full_path: "c3pr/sample-project-java-maven",
                author: "someusername",
                clone_url_http: "https://github.com/c3pr/sample-project-java-maven.git",
                branch: "branch-for-clone-tests",
                revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
            },
            changed_files: ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/boo.txt'],
        };

        const agents = [
            {key: "agent://one", value: {tool_id: "one", extensions: ["java", "js"], tags: ["java", "js"]}, timeout: "2028-05-15T15:30:27.667Z"},
            {key: "agent://two", value: {tool_id: "two", extensions: ["js"], tags: ["js"]}, timeout: "2028-05-15T15:30:28.667Z"},
        ];
        configureFetchAllToolAgents(agents);

        let toolOneCalled = false;
        let toolTwoCalled = false;
        axiosMock
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/ToolInvocationRequested`,
                {parent, repository: changes.repository, tool_id: "two", files: ['src/main/a/b/c/Main.js']}
            ).reply(() => { toolTwoCalled = true; return [200]; })
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/ToolInvocationRequested`,
                {parent, repository: changes.repository, tool_id: "one", files: ['src/main/a/b/c/Main.java']}
            ).reply(() => { toolOneCalled = true; return [200]; });

        // execute
        await invokeTools({parent, repository: changes.repository, files: changes.changed_files});

        // verify
        expect(toolOneCalled).to.equal(true);
        expect(toolTwoCalled).to.equal(true);
    });

    it('should not send file forward if it was modified by previous tool invocation', async () => {

    });

});

