const os = require("os");
const hubClientConfig = require('node-c3pr-hub-client').hubClientConfig;

const PORT = process.env.PORT || 7305;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:7300`;

const config = {
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

hubClientConfig.init(C3PR_HUB_URL, () => config.c3pr.hub.auth.jwt);
module.exports = config;