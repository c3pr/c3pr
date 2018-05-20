const os = require("os");
const PORT = process.env.PORT || 5005;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

module.exports = {
    c3pr: {
        port: PORT,

        auth: {
            jwt: null
        },

        dashboard: {
            c3prDashboardPort: PORT,

            mongoLogsUri: process.env.C3PR_MONGO_URL,
            mongoLogsDatabase: 'c3pr',
            mongoLogsCollection: 'logs',
        },

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
        }
    }
};