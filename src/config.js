const MONGO_LOGS_URI = process.env.MONGO_LOGS_URI;

module.exports = {
    c3pr: {
        mongoLogsUri: MONGO_LOGS_URI,
        mongoLogsDatabase: 'c3pr',
        mongoLogsCollection: 'logs'
    }
};