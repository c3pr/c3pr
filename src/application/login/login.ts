import {InboundPorts} from "../../ports/inbound/InboundPorts";
import config from '../../config';

import { c3prHubClient } from 'node-c3pr-hub-client/login';

function c3prRepoGitLabLogin(): Promise<void> {
    return c3prHubClient.login({
        loginUrl: config.c3pr.hub.loginUrl,
        username: 'c3pr-repo-gitlab',
        password: 'unused',
        subscriptions: [
            {eventType: "PullRequestRequested", callbackUrl: config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl}
        ],
        logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'login'}]
    }).then(jwt => {
        config.c3pr.hub.auth.jwt = jwt;
    }).catch(e => {
        throw e;
    });
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: InboundPorts['c3prRepoGitLabLogin'] = c3prRepoGitLabLogin;
export { c3prRepoGitLabLogin };