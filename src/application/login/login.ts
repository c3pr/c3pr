import config from '../../config';

import c3prHubLogin from 'node-c3pr-hub-client/login';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

const _c3prLOG5 = c3prLOG5({sha: '!repo-gitlab-login'});

function c3prRepoGitLabLogin(): Promise<void> {
    return c3prHubLogin(
        {
        loginUrl: config.c3pr.hub.loginUrl,
        username: 'c3pr-repo-gitlab',
        password: 'unused',
        subscriptions: [
            {eventType: "PullRequestRequested", callbackUrl: config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
        ]
        },
        _c3prLOG5
    ).then(jwt => {
        config.c3pr.hub.auth.jwt = jwt;
    }).catch(e => {
        throw e;
    });
}

export { c3prRepoGitLabLogin };