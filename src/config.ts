const PORT = process.env.PORT;
const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL || 'mongodb://127.0.0.1:27017';
const C3PR_MONGO_DATABASE = process.env.C3PR_MONGO_DATABASE || 'c3pr';
const C3PR_MONGO_LOGS_COLLECTION = process.env.C3PR_MONGO_LOGS_COLLECTION || 'logs44';

export = {
    c3pr: {
        hub: {
            port: PORT || 7300,

            mongoC3prUrl: C3PR_MONGO_URL,
            mongoC3prDatabase: C3PR_MONGO_DATABASE,
            mongoEventsCollection: 'events',

            uncollectPollingInMs: 4 * 60 * 1000, // 4 minutes
            uncollectTimeoutInMs: 10 * 60 * 1000, // 10 minutes

            broadcastIntervalInMs: 2 * 60 * 1000, // 2 minutes

            mongoProjectsCollection: 'projects',
            mongoPRsCollection: 'prs',
            mongoProjectFilesCollection: 'project_files',
            mongoAgentRegistryCollection: 'agents',

            mongoLogsCollection: C3PR_MONGO_LOGS_COLLECTION,

            numberOfSimultaneousProcessingEvents: 5,

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