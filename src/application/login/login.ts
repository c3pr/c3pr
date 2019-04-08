import config from '../../config';

import { c3prHubClient } from 'node-c3pr-hub-client/login';

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const sha = 'gitlab-login';
const euuid = sha;

function c3prRepoGitLabLogin(): Promise<void> {
    return c3prHubClient.login({
        loginUrl: config.c3pr.hub.loginUrl,
        username: 'c3pr-repo-gitlab',
        password: 'unused',
        subscriptions: [
            {eventType: "PullRequestRequested", callbackUrl: config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
        ],
        lcid, sha, euuid
    }).then(jwt => {
        config.c3pr.hub.auth.jwt = jwt;
    }).catch(e => {
        throw e;
    });
}

export { c3prRepoGitLabLogin };