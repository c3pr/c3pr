const os = require("os");

const C3PR_BOT_BASE_URL = process.env.C3PR_C3PR_URL || `http://${os.hostname()}:5001`;
const PORT = process.env.PORT || 5002;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;
const C3PR_REPO_GITHUB_URL = process.env.C3PR_REPO_GITHUB_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {

        port: PORT,
        changesUrl: `${C3PR_BOT_BASE_URL}/changes`,
        prsUrl: `${C3PR_REPO_GITHUB_URL}/prs`,

        gitHubApiToken: GITHUB_API_TOKEN,
        gitUserName: 'c3pr-bot',
        gitUserEmail: 'c3prbot@gmail.com',

    }
};