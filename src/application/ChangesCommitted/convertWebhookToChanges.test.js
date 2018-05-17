const expect = require('chai').expect;
const sinon = require('sinon');

const convertWebhookToChanges = require('./convertWebhookToChanges');
const webhookRequestExample = require('./webhookRequestExample.json');
const config = require('../../config');

const now = new Date();

const changesCommittedONE = {
    "date": now.toISOString(),

    "repository": {
        "full_path": "c3pr/sample-project-java-maven",
        "author": "root",
        "clone_url_http": "http://127.0.0.1:8090/c3pr/sample-project-java-maven.git",
        "branch": "master",
        "revision": "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    },

    "changed_files": ["src/main/resources/second.txt", "src/main/resources/third.txt"]
};

const changesCommittedTWO = {
    "date": now.toISOString(),

    "repository": {
        "full_path": "!fullpath!",
        "author": "someusername",
        "clone_url_http": "!git_http_url!",
        "branch": "w00t-a-branch",
        "revision": "after-hash"
    },

    "changed_files": ["f1", "f3"]
};


describe('convertWebhookToChanges', function () {

    let sandbox, clock;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock = sinon.useFakeTimers(now.getTime());

        config.c3pr.prsUrl = "http://prs/prs";
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it('should consolidate changeset and get repo information', function () {
        const changes = convertWebhookToChanges(webhookRequestExample);
        expect(changes).to.deep.equal(changesCommittedONE);
    });

    it('more elaborate example', function () {
        const changes = convertWebhookToChanges({
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
        });
        expect(changes).to.deep.equal(changesCommittedTWO);
    });

});