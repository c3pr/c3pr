const mongodb = require('mongodb');
const config = require('../config');

async function fetchLogs() {
    const client = await mongodb.MongoClient.connect(config.c3pr.dashboard.mongoLogsUri);

    let logsCollection = client.db(config.c3pr.dashboard.mongoLogsDatabase).collection(config.c3pr.dashboard.mongoLogsCollection);
    let logs = await logsCollection.find().sort({dateTime: 1}).toArray();

    await client.close();
    return logs;
}

module.exports = fetchLogs;