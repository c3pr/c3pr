const expect = require('chai').expect;
const convertWebhookToChanges = require('./convertWebhookToChanges');
const webhookRequestExample = require('./webhookRequestExample.json');

const whatBotNeedsToInvokeTools = {
    meta: {
        correlationId: "13b7eedacc076e8a16ae565b535fd48edb9a044a",
        compatibleSchemas: ["c3pr/c3pr::changes"]
    },
    changeset: ['src/main/resources/second.txt', 'src/main/resources/third.txt'],
    repository: {
        type: "git",
        url: "https://github.com/c3pr/sample-project-java-maven.git",
        branch: "someeee-branchhhh",
        revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    }
};

describe('convertWebhookToChanges', function () {

    it('should consolidate changeset and get repo information', function () {
        const changes = convertWebhookToChanges(webhookRequestExample);
        expect(changes).to.deep.equal(whatBotNeedsToInvokeTools);
    });

    it('more elaborate example', function () {
        const changes = convertWebhookToChanges({
            after: "after-hash",
            repository: { clone_url: "clone-url" },
            commits: [
                {added: [], removed: [], modified: ['m2', 'm3']},
                {added: [], removed: [], modified: ['m1']},
                {added: [], removed: [], modified: []},
            ]
        });
        expect(changes).to.deep.equal({
            meta: {
                correlationId: "after-hash",
                compatibleSchemas: ["c3pr/c3pr::changes"]
            },
            changeset: ['m2', 'm3', 'm1'],
            repository: {
                type: "git",
                url: "clone-url",
                branch: "w000-a-branch",
                revision: "after-hash"
            }
        });
    });

});