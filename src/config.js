const os = require("os");
const C3PR_BOT_BASE_URL = process.env.C3PR_C3PR_URL || `http://${os.hostname()}:5001`;
const PORT = process.env.PORT || 5002;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: `${C3PR_BOT_BASE_URL}/changes`,
        prsUrl: (process.env.C3PR_REPO_GITHUB_URL || `http://${os.hostname()}:${PORT}`) + "/prs",
        print() {
            console.log(`c3pr (bot) changes URL will be: ${this.changesUrl}`);
            console.log(`c3pr-repo-github prs URL will be: ${this.prsUrl}`)
        }
    }
};