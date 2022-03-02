const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL || 'mongodb://127.0.0.1:27017';
const C3PR_MONGO_DATABASE = process.env.C3PR_MONGO_DATABASE || 'c3pr';
const C3PR_MONGO_LOGS_COLLECTION = process.env.C3PR_MONGO_LOGS_COLLECTION || 'logs4';

module.exports = {
    c3pr: {
        logger: {
            mongoUrl: C3PR_MONGO_URL,
            database: C3PR_MONGO_DATABASE,
            collection: C3PR_MONGO_LOGS_COLLECTION
        }
    }
};