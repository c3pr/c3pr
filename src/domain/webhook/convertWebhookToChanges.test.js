const expect = require('chai').expect;
const sinon = require('sinon');

const convertWebhookToChanges = require('./convertWebhookToChanges');
const webhookRequestExample = require('./webhookRequestExample.json');
const config = require('../../config');

const now = new Date();

const whatBotNeedsToInvokeTools = {
    meta: {
        correlationId: "13b7eedacc076e8a16ae565b535fd48edb9a044a",
        compatibleSchemas: ["c3pr/c3pr::changes"],
        dates: [{date: now.toISOString(), node: "c3pr-repo-gitlab"}]
    },
    c3pr: {prsUrl: "http://prs/prs"},
    changeset: ['src/main/resources/second.txt', 'src/main/resources/third.txt'],
    repository: {
        type: "git",
        url: "http://127.0.0.1:8090/c3pr/sample-project-java-maven.git",
        branch: "master",
        revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    }
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
        expect(changes).to.deep.equal(whatBotNeedsToInvokeTools);
    });

    it('more elaborate example', function () {
        const changes = convertWebhookToChanges({
            ref: "refs/heads/w00t-a-branch",
            after: "after-hash",
            repository: { git_http_url: "!git_http_url!" },
            commits: [
                {timestamp: '1', added: ['m2'], removed: [], modified: ['m3']},
                {timestamp: '3', added: [], removed: ['m2'], modified: ['m1']},
                {timestamp: '2', added: [], removed: [], modified: ['m2']},
            ]
        });
        expect(changes).to.deep.equal({
            meta: {
                correlationId: "after-hash",
                compatibleSchemas: ["c3pr/c3pr::changes"],
                dates: [{date: now.toISOString(), node: "c3pr-repo-gitlab"}]
            },
            c3pr: {prsUrl: "http://prs/prs"},
            changeset: ['m1', 'm3'],
            repository: {
                type: "git",
                url: "!git_http_url!",
                branch: "w00t-a-branch",
                revision: "after-hash"
            }
        });
    });

});