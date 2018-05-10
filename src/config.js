const os = require("os");
const PORT = process.env.PORT || 5000;

const c3prBaseUrl = process.env.C3PR_REGISTRY_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {
        port: PORT,
        registryUrl: `${c3prBaseUrl}/api/v1/registry`,
        mongoLogsUri: process.env.MONGO_LOGS_URI,
        mongoLogsDatabase: 'c3pr',
        mongoLogsCollection: 'logs'
    }
};