const PORT = process.env.PORT;
const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL || 'mongodb://127.0.0.1:27017';
const C3PR_MONGO_DATABASE = process.env.C3PR_MONGO_DATABASE || 'c3pr';
const C3PR_MONGO_LOGS_COLLECTION = process.env.C3PR_MONGO_LOGS_COLLECTION || 'logs4';

export = {
    c3pr: {
        hub: {
            port: PORT || 7300,

            mongoC3prUrl: C3PR_MONGO_URL,
            mongoC3prDatabase: C3PR_MONGO_DATABASE,
            mongoEventsCollection: 'events',

            uncollectPollingInMs: 5 * 60 * 1000, // five minutes
            uncollectTimeoutInMs: 60 * 60 * 1000, // one hour

            broadcastIntervalInMs: 5 * 60 * 1000, // five minutes

            mongoProjectsCollection: 'projects',
            mongoPRsCollection: 'prs',
            mongoProjectFilesCollection: 'project_files',
            mongoAgentRegistryCollection: 'agents',

            mongoLogsCollection: C3PR_MONGO_LOGS_COLLECTION,

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