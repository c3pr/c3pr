const os = require("os");

const PORT = process.env.PORT || 5004;
const C3PR_REPO_GITLAB_URL = process.env.C3PR_REPO_GITLAB_URL || `http://localhost:${PORT}` || `http://${os.hostname()}:${PORT}`;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const GITLAB_URL = 'http://127.0.0.1:8090';
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;

const WEBHOOKS_URL = `/webhooks`;

module.exports = {
    c3pr: {

        url: C3PR_REPO_GITLAB_URL,

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
        },

        repoGitlab: {
            c3prRepoGitlabUrl: C3PR_REPO_GITLAB_URL,
            c3prRepoGitlabPort: require('url').parse(C3PR_REPO_GITLAB_URL).port || 80,

            PullRequestRequestedCallbackUrl: `/callbacks/PullRequestRequested`,

            webhooksUrl: WEBHOOKS_URL,

            gitlab: {
                url: GITLAB_URL,
                apiToken: GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3', // api + read_user token for the gitUserName gitlab user
            }
        },

        gitHubApiToken: GITLAB_API_TOKEN,

        gitLabUrl: GITLAB_URL,
        gitUserName: 'c3pr-bot',
        gitUserEmail: 'c3prbot@gmail.com',
        gitLabApiToken: GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3', // api + read_user token for the gitUserName gitlab user

        gitlabUrlTransform(url) {
            let gitlabUrl = GITLAB_URL;
            if (!gitlabUrl.endsWith('/')) {
                gitlabUrl += '/';
            }
            return url.replace(/^https?:\/\/[^\/]+\//, gitlabUrl)
        }

    }
};