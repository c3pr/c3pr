const config = require('../../config');

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    subscriptions: [
        {eventType: "PullRequestRequested",    callbackUrl: config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
    ],
    logMetas: [{nodeName: 'c3pr-repo-gitlab'}]
}).then(({data: jwt}) => {
    config.c3pr.jwt = jwt;
}).catch(e => {
    throw e;
});