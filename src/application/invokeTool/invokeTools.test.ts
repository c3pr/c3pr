import c3prLOG4 from 'node-c3pr-logger/c3prLOG4';
c3prLOG4.testMode();
process.env.NODE_ENV = 'test';


import { expect } from 'chai';
require('chai').should();

import * as shuffleArrayModule from "../../adapters/shuffleArray";
// @ts-ignore
shuffleArrayModule.shuffleArray = a => a; // shuffleArray won't shuffle a thing

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

import config from '../../config';
import invokeTools from "./invokeTools";


function configureFetchAllToolAgents(agents) {
    axiosMock
        .onGet(config.c3pr.hub.agentsUrl, {headers: {Authorization: `Bearer ${config.c3pr.auth.jwt}`}})
        .reply(200, agents, {'content-type': 'application/json'});
}


describe('invokeTools', () => {

    it('should emit a ToolInvocationRequested for each file that have a tool available', async () => {

        const parentEvent = {event_type: "ChangesCommitted", uuid: "uuid-12312-3123123-12312" };
        const changesCommittedRootEuuid = "uuid-....123123123...";
        const changes = {
            repository: {
                full_path: "c3pr/sample-project-java-maven",
                push_user: {id: 1, username: "someusername"},
                clone_url_http: "https://github.com/c3pr/sample-project-java-maven.git",
                branch: "branch-for-clone-tests",
                revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
            },
            changed_files: ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/boo.txt'],
        };

        const agents = [
            {tool_id: "one", extensions: ["java", "js"], tags: ["java", "js"]},
            {tool_id: "two", extensions: ["js"],         tags: ["js"]},
        ];
        configureFetchAllToolAgents(agents);

        let toolOneCalled = false;
        let toolTwoCalled = false;
        axiosMock
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/ToolInvocationRequested`,
                {parentEvent, changesCommittedRootEuuid, repository: changes.repository, tool_id: "two", files: ['src/main/a/b/c/Main.js']}
            ).reply(() => { toolTwoCalled = true; return [200]; })
            .onPost(
                `${config.c3pr.hub.c3prHubUrl}/api/v1/events/ToolInvocationRequested`,
                {parentEvent, changesCommittedRootEuuid, repository: changes.repository, tool_id: "one", files: ['src/main/a/b/c/Main.java']}
            ).reply(() => { toolOneCalled = true; return [200]; });

        // execute
        await invokeTools({parentEvent, changesCommittedRootEuuid, repository: changes.repository}, changes.changed_files, () => {});

        // verify
        expect(toolOneCalled).to.equal(true);
        expect(toolTwoCalled).to.equal(true);
    });

});

