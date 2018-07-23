import config from '../../config';

import { c3prHubClient } from 'node-c3pr-hub-client/login';

function c3prRepoGitLabLogin(): Promise<void> {
    return c3prHubClient.login({
        loginUrl: config.c3pr.hub.loginUrl,
        username: 'c3pr-repo-gitlab',
        password: 'unused',
        subscriptions: [
            {eventType: "PullRequestRequested", callbackUrl: config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
        ]
    }).then(jwt => {
        config.c3pr.hub.auth.jwt = jwt;
    }).catch(e => {
        throw e;
    });
}

export { c3prRepoGitLabLogin };