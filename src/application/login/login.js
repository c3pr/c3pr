const config = require('../../config');

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    username: 'c3pr-repo-gitlab',
    password: 'unused',
    subscriptions: [
        {eventType: "PullRequestRequested",    callbackUrl: config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
    ],
    logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'login'}]
}).then(jwt => {
    config.c3pr.hub.auth.jwt = jwt;
}).catch(e => {
    throw e;
});