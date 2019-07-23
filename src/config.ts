import os = require("os");
import { hubClientConfig } from "node-c3pr-hub-client";

const PORT = process.env.PORT || 7304;
const C3PR_REPO_GITLAB_URL = process.env.C3PR_REPO_GITLAB_URL || `http://localhost:${PORT}` || `http://${os.hostname()}:${PORT}`;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:7300`;

const GITLAB_URL = process.env.GITLAB_URL || 'http://c3prgitlab:8888';
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3';

// used as (1) commit author, (2) mr author, and (3) namespace for the forks
const GITLAB_BOT_USER_ID = +(process.env.GITLAB_BOT_USER_ID || "15");
const GITLAB_BOT_USER_USERNAME = process.env.GITLAB_BOT_USER_USERNAME || 'c3pr-bot';
const GITLAB_BOT_USER_EMAIL = process.env.GITLAB_BOT_USER_EMAIL || 'c3prbot@gmail.com';

const WEBHOOKS_URL = `/webhooks`;

const config = {
    c3pr: {

        hub: {
            auth: {
                jwt: null,
            },

            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
        },

        repoGitlab: {
            c3prRepoGitlabUrl: C3PR_REPO_GITLAB_URL,
            c3prRepoGitlabPort: require('url').parse(C3PR_REPO_GITLAB_URL).port || 80,

            PullRequestRequestedCallbackUrl: `/callbacks/PullRequestRequested`,
            CommentPullRequestCallbackUrl: `/callbacks/CommentPullRequest`,

            webhooksUrl: WEBHOOKS_URL,

            gitlab: {
                url: GITLAB_URL,
                apiToken: GITLAB_API_TOKEN, // api + read_user token for the gitUserName gitlab user

                bot_user_id: GITLAB_BOT_USER_ID,
                botUserName: GITLAB_BOT_USER_USERNAME,
                botUserEmail: GITLAB_BOT_USER_EMAIL,

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
