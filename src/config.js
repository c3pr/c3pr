const PORT = process.env.PORT || 5000;

module.exports = {
    c3pr: {
        hub: {
            port: PORT,

            mongoC3prUrl: process.env.C3PR_MONGO_URL,
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