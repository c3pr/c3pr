import {expect} from 'chai';

import eventsDBFake from '../../../test/application/eventsDBFake';
import invokeTools from "./invokeTools";

import * as c3prHubRegisterNewEventModule from 'node-c3pr-hub-client/events/registerNewEvent';

import * as fetchAllToolAgentsModule from "./fetchAllToolAgents";
let toolAgents = [];
(fetchAllToolAgentsModule as any).default = () => toolAgents;

const fakeLOG = () => fakeLOG;

const rrr = {"clone_url_http": "http://git.foo/bar.git", "revision": "sha-1"};

describe('invokeTools', () => {

    let rne;
    beforeEach(() => {
        rne = c3prHubRegisterNewEventModule.default;
        (c3prHubRegisterNewEventModule as any).default = async ({event_type, payload}) => ({event_type, payload});
        eventsDBFake.load();
    });
    afterEach(() => {
        (c3prHubRegisterNewEventModule as any).default = rne;
        eventsDBFake.unload();
    });

    it('no tirs', async () => {
        // setup:
        eventsDBFake.setOptions({cutTime: "2000-01-01T00:02:00.000Z"});

        toolAgents = [
            {tool_id: "tool:t1", extensions: ["js"], tags: [], weight: 100},
            {tool_id: "tool:t2", extensions: ["c"], tags: [], weight: 100},
            {tool_id: "tool:t3", extensions: ["js"], tags: [], weight: 200},
        ];

        // execute:
        let invocationPromises = await invokeTools(
            {parentEvent: null, changesCommittedRootEuuid: "UUID-02", repository: rrr},
            ["src/f1.js", "src/f2.js", "src/f3.c"],
            fakeLOG
        );

        const invocations = await Promise.all(invocationPromises);
        // console.log(JSON.stringify(invocations, null, '  '));

        // verify:
        expect(invocations).to.deep.equal([
            {
                event_type: "ToolInvocationRequested",
                payload: {
                    changes_committed_root: "UUID-02",
                    files: ["src/f1.js", "src/f2.js"],
                    parent: null,
                    repository: {clone_url_http: "http://git.foo/bar.git", revision: "sha-1"},
                    tool_id: "tool:t1",
                },
            },
            {
                event_type: "ToolInvocationRequested",
                payload: {
                    changes_committed_root: "UUID-02",
                    files: ["src/f3.c"],
                    parent: null,
                    repository: {clone_url_http: "http://git.foo/bar.git", revision: "sha-1"},
                    tool_id: "tool:t2",
                }
            }
        ]);
    }).timeout(2_000);

});
