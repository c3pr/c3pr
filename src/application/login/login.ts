import configx from '../../config';

import * as c3prhc from 'node-c3pr-hub-client/login';

let c3prHubClient = c3prhc.c3prHubClient;

c3prHubClient.login({
    loginUrl: configx.c3pr.hub.loginUrl,
    username: 'c3pr-repo-gitlab',
    password: 'unused',
    subscriptions: [
        {eventType: "PullRequestRequested",    callbackUrl: configx.c3pr.repoGitlab.c3prRepoGitlabUrl + configx.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
    ],
    logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'login'}]
}).then(jwt => {
    configx.c3pr.hub.auth.jwt = jwt;
}).catch(e => {
    throw e;
});