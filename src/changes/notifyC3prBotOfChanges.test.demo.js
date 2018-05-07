const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const notifyC3prBotOfChanges = require('./notifyC3prBotOfChanges');

const changes = {
    meta: {
        correlationId: "13b7eedacc076e8a16ae565b535fd48edb9a044a",
        compatibleSchemas: ["c3pr/c3pr::changes"],
        dates: [{date: new Date().toISOString(), node: "c3pr-repo-gitlab"}]
    },
    c3pr: {
        prsUrl: "http://localhost:5002/prs"
    },
    changeset: ['src/main/resources/second.java', 'src/main/resources/third.txt'],
    repository: {
        type: "git",
        url: "https://github.com/c3pr/sample-project-java-maven.git",
        branch: "master",
        revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    }
};

const changesUrl = 'http://localhost:5001/changes';
const config = {c3pr: {changesUrl}};

axiosMock.onPost(changesUrl, changes).reply(200, {}, {'content-type': 'application/json'});

describe('notifyC3prBotOfChanges', () => {
    it('notifyC3prBotOfChanges', async () => {
        await notifyC3prBotOfChanges(config, changes);
    });
});

