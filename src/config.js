const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL;

module.exports = {
    c3pr: {
        logger: {
            mongoUrl: C3PR_MONGO_URL,
            database: 'c3pr',
            collection: 'logs'
        }
    }
};