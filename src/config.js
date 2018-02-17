const os = require("os");

const C3PR_BOT_BASE_URL = process.env.C3PR_C3PR_URL || `http://${os.hostname()}:5001`;
const PORT = process.env.PORT || 5002;
const gitHubApiToken = process.env.GITHUB_API_TOKEN;
const C3PR_REPO_GITHUB_URL = process.env.C3PR_REPO_GITHUB_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {
        gitHubApiToken: gitHubApiToken,
        port: PORT,
        changesUrl: `${C3PR_BOT_BASE_URL}/changes`,
        prsUrl: `${C3PR_REPO_GITHUB_URL}/prs`,
        print() {
            console.log(`c3pr (bot) changes URL will be: ${this.changesUrl}`);
            console.log(`c3pr-repo-github prs URL will be: ${this.prsUrl}`)
        }
    }
};