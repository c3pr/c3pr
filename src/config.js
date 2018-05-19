module.exports = {
    c3pr: {
        logger: {
            mongoUrl: process.env.C3PR_MONGO_URL || 'mongodb://127.0.0.1:27017',
            database: 'c3pr',
            collection: 'logs'
        }
    }
};