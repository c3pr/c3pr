const PORT = process.env.PORT || 5001;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: (process.env.C3PR_C3PR_URL || `http://${os.hostname()}:${PORT}`) + "/changes"
    }
};