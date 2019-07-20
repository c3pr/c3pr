import {expect} from 'chai';

import setOptions from '../../../test/application/eventsDBFake';
import calculateToolsAlreadyInvokedPerFile from "./calculateToolsAlreadyInvokedPerFile";


describe('calculateToolsAlreadyInvokedPerFile', () => {

    it('no tirs', async () => {
        // setup:
        setOptions({cutTime: "2000-01-01T00:02:00.000Z", events});

        // execute:
        let actualToolsAlreadyInvoked = await calculateToolsAlreadyInvokedPerFile("UUID-02");

        console.log(JSON.stringify(actualToolsAlreadyInvoked, null, '  '));
        // verify:
        expect(actualToolsAlreadyInvoked).to.deep.equal({});
    }).timeout(2_000);

    it('one tir', async () => {
        // setup:
        setOptions({cutTime: "2000-01-01T00:03:00.000Z", events});

        // execute:
        let actualToolsAlreadyInvoked = await calculateToolsAlreadyInvokedPerFile("UUID-02");

        console.log(JSON.stringify(actualToolsAlreadyInvoked, null, '  '));
        // verify:
        expect(actualToolsAlreadyInvoked).to.deep.equal({
            "src/f1.js": [
                "tool:t1"
            ],
            "src/f2.js": [
                "tool:t1"
            ]
        });
    }).timeout(2_000);

    it('two tirs', async () => {
        // setup:
        setOptions({cutTime: "2000-01-01T00:04:00.000Z", events});

        // execute:
        let actualToolsAlreadyInvoked = await calculateToolsAlreadyInvokedPerFile("UUID-02");

        console.log(JSON.stringify(actualToolsAlreadyInvoked, null, '  '));
        // verify:
        expect(actualToolsAlreadyInvoked).to.deep.equal({
            "src/f1.js": [
                "tool:t1"
            ],
            "src/f2.js": [
                "tool:t1"
            ],
            "src/f3.c": [
                "tool:t2"
            ]
        });
    }).timeout(2_000);

});

const events = [
    {
        "uuid": "UUID-02",
        "event_type": "ChangesCommitted",
        "meta": {"created": "2000-01-01T00:02:00.000Z"},
        "payload": {
            "repository": {"clone_url_http": "http://git.foo/bar.git", "revision": "sha-1"},
            "changed_files": ["src/f1.js", "src/f2.js", "src/f3.c"],
            "renames": [{"from": "src/fx.js", "to": "src/f1.js"}]
        }
    },
    {
        "uuid": "UUID-03",
        "event_type": "ToolInvocationRequested",
        "meta": {"created": "2000-01-01T00:03:00.000Z"},
        "payload": {
            "parent": {"event_type": "ChangesCommitted", "uuid": "UUID-02"},
            "changes_committed_root": "UUID-02",
            "repository": {"clone_url_http": "http://git.foo/bar.git", "revision": "sha-1"},
            "tool_id": "tool:t1",
            "files": ["src/f1.js", "src/f2.js"]
        }
    },
    {
        "uuid": "UUID-04",
        "event_type": "ToolInvocationRequested",
        "meta": {"created": "2000-01-01T00:04:00.000Z"},
        "payload": {
            "parent": {"event_type": "ChangesCommitted", "uuid": "UUID-02"},
            "changes_committed_root": "UUID-02",
            "repository": {"clone_url_http": "http://git.foo/bar.git", "revision": "sha-1"},
            "tool_id": "tool:t2",
            "files": ["src/f3.c"]
        }
    },
];