const request = require('request');
const config = require('../../config');

const notifyC3prBotOfChanges = require('./notifyC3prBotOfChanges');

const changes = {
    changeset: ['src/main/resources/second.txt', 'src/main/resources/third.txt'],
    repository: {
        type: "git",
        url: "https://github.com/c3pr/sample-project-java-maven.git",
        revision: "13b7eedacc076e8a16ae565b535fd48edb9a044a"
    }
};
config.c3pr.botChangesUrl = 'http://localhost:5001/changes';
notifyC3prBotOfChanges(changes);
