const PORT = process.env.PORT;
const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL;

module.exports = {
    c3pr: {
        hub: {
            port: PORT || 5000,

            mongoC3prUrl: C3PR_MONGO_URL || 'http://127.0.0.1:27017',
            mongoC3prDatabase: 'c3pr',
            mongoEventsCollection: 'events',
            uncollectPollingInMs: 5 * 60 * 1000, // five minutes
            uncollectTimeoutInMs: 60 * 60 * 1000, // one hour

            mongoProjectsCollection: 'projects',
            mongoPRsCollection: 'prs',
            mongoAgentRegistryCollection: 'agents',

            mongoLogsCollection: 'logs',

            bus: {
                maxRetries: 2,
                retryWaitingTimeInMs: 5 * 1000 // 5 seconds
            },

            agentRegistry: {
                cleanRegistryStepInMs: 20 * 1000 // 20 seconds
            }
        },
    }
};