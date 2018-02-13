const config = require('../../config');

const notifyC3prBotOfChanges = require('./notifyC3prBotOfChanges');

const changes = {
    meta: {
        correlationId: "13b7eedacc076e8a16ae565b535fd48edb9a044a",
        compatibleSchemas: ["c3pr/c3pr::changes"],
        dates: [{date: new Date().toISOString(), node: "c3pr-repo-github"}]
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
config.c3pr.changesUrl = 'http://localhost:5001/changes';
notifyC3prBotOfChanges(changes);
