import os = require("os");
import { hubClientConfig } from "node-c3pr-hub-client";

const PORT = process.env.PORT || 5004;
const C3PR_REPO_GITLAB_URL = process.env.C3PR_REPO_GITLAB_URL || `http://localhost:${PORT}` || `http://${os.hostname()}:${PORT}`;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const GITLAB_URL = process.env.GITLAB_URL || 'http://c3prgitlab:8888';
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3';

const WEBHOOKS_URL = `/webhooks`;

const config = {
    c3pr: {

        hub: {
            auth: {
                jwt: null,
            },

            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
            projectsByCloneUrlHttp: (clone_url_http) => `${C3PR_HUB_URL}/api/v1/projects/?clone_url_http=${clone_url_http}`,
        },

        repoGitlab: {
            c3prRepoGitlabUrl: C3PR_REPO_GITLAB_URL,
            c3prRepoGitlabPort: require('url').parse(C3PR_REPO_GITLAB_URL).port || 80,

            PullRequestRequestedCallbackUrl: `/callbacks/PullRequestRequested`,

            webhooksUrl: WEBHOOKS_URL,

            gitlab: {
                url: GITLAB_URL,
                apiToken: GITLAB_API_TOKEN, // api + read_user token for the gitUserName gitlab user

                botUserName: 'c3pr-bot', // used as (1) commit author, (2) mr author, and (3) namespace for the forks
                botUserEmail: 'c3prbot@gmail.com',

                normalizeGitLabUrl(url) {
                    let gitlabUrl = GITLAB_URL;
                    if (!gitlabUrl.endsWith('/')) {
                        gitlabUrl += '/';
                    }
                    return url.replace(/^https?:\/\/[^\/]+\//, gitlabUrl)
                }
            }
        }

    }
};

hubClientConfig.init(C3PR_HUB_URL, () => config.c3pr.hub.auth.jwt);
export default config;
