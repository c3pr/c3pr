const os = require("os");
const PORT = process.env.PORT || 5000;

const c3prBaseUrl = process.env.C3PR_C3PR_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: `${c3prBaseUrl}/changes`,
        patchesUrl: `${c3prBaseUrl}/patches`,
        mongoLogsUri: process.env.MONGO_LOGS_URI,
        mongoLogsDatabase: 'c3pr',
        mongoLogsCollection: 'logs'
    }
};