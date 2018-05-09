const os = require("os");

const C3PR_BRAIN_URL = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;
const PORT = process.env.PORT || 5004;
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;
const C3PR_REPO_GITLAB_URL = process.env.C3PR_REPO_GITLAB_URL || `http://localhost:${PORT}` || `http://${os.hostname()}:${PORT}`;

const GITLAB_URL = 'http://127.0.0.1:8090';

module.exports = {
    c3pr: {

        port: PORT,
        url: C3PR_REPO_GITLAB_URL,

        changesUrl: `${C3PR_BRAIN_URL}/changes`,
        prsUrl: `${C3PR_REPO_GITLAB_URL}/prs`,
        webhooksUrl: `${C3PR_REPO_GITLAB_URL}/webhooks`,

        gitHubApiToken: GITLAB_API_TOKEN,

        gitLabUrl: GITLAB_URL,
        gitUserName: 'c3pr-bot',
        gitUserEmail: 'c3prbot@gmail.com',
        gitLabApiToken: GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3', // api + read_user token for the gitUserName gitlab user

        gitlabUrlTransform(url) {
            return url.replace(/^https?:\/\/[^\/]+\//, GITLAB_URL)
        }

    }
};