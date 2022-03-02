import { expect } from 'chai';
import sinon = require('sinon');
import {createChangesCommitted} from "./createChangesCommitted";

let webhookRequestExample = require('../../ports/outbound/types/GitLabPush/push.webhook.json');

const now = new Date();

const changesCommittedONE = {
    "date": now.toISOString(),

    "repository": {
        "full_path": "c3pr/sample-project-java-maven",
        "push_user": {"id": 1, "username": "root"},
        "clone_url_http": "http://c3prgitlab:8888/c3pr/sample-project-java-maven.git",
        "branch": "master",
        "revision": "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    },

    "changed_files": ["src/main/resources/second.txt", "src/main/resources/third.txt"]
};

const changesCommittedTWO = {
    "date": now.toISOString(),

    "repository": {
        "full_path": "!fullpath!",
        "push_user": {"id": 395, "username": "someusername"},
        "clone_url_http": "!git_http_url!",
        "branch": "w00t-a-branch",
        "revision": "after-hash"
    },

    "changed_files": ["f1", "f3"]
};

const fakeLog = (...a) => { console.log(...a); return fakeLog; };

describe('convertWebhookToChanges', function () {

    let sandbox, clock;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock = sinon.useFakeTimers(now.getTime());
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it('should consolidate changeset and get repo information', async function () {
        const changes = await createChangesCommitted(webhookRequestExample, fakeLog);
        expect(changes).to.deep.equal(changesCommittedONE);
    });

    it('more elaborate example', async function () {
        const changes = await createChangesCommitted({
            user_username: "someusername",
            ref: "refs/heads/w00t-a-branch",
            after: "after-hash",
            project: { path_with_namespace: "!fullpath!" },
            repository: { git_http_url: "!git_http_url!" },
            commits: [
                {timestamp: '1', added: ['f2'], removed: [],     modified: ['f3']},
                {timestamp: '3', added: [],     removed: ['f2'], modified: ['f1']},
                {timestamp: '2', added: [],     removed: [],     modified: ['f2']},
            ]
        } as any, fakeLog);
        expect(changes).to.deep.equal(changesCommittedTWO);
    });

});