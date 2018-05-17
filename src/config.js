const os = require("os");
const PORT = process.env.PORT || 5000;

const C3PR_REGISTRY_URL = process.env.C3PR_REGISTRY_URL || `http://${os.hostname()}:${PORT}/api/v1/registry`;

module.exports = {
    c3pr: {
        port: PORT,
        registryUrl: C3PR_REGISTRY_URL,
        mongoLogsUri: process.env.MONGO_LOGS_URI,
        mongoLogsDatabase: 'c3pr',
        mongoLogsCollection: 'logs',
        hub: {
            mongoC3prUri: process.env.MONGO_LOGS_URI,
            mongoC3prDatabase: 'c3pr',
            mongoEventsCollection: 'events',
            uncollectPollingInMs: 5 * 60 * 1000, // five minutes
            uncollectTimeoutInMs: 60 * 60 * 1000, // one hour

            bus: {
                maxRetries: 2,
                retryWaitingTimeInMs: 5 * 1000 // 5 seconds
            }
        },
    }
};