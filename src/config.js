const C3PR_BOT_BASE_URL = 'https://c3pr.herokuapp.com';
const PORT = process.env.PORT || 5002;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: `${C3PR_BOT_BASE_URL}/changes`,
        prUrl:  process.env.C3PR_REPO_GITHUB_URL || `http://${os.hostname()}:${PORT}`
    }
};