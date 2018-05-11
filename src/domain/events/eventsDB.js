const MongoClient = require("mongodb").MongoClient;
const config = require('../../config');
const Status = require('./status');

const client = MongoClient.connect(config.c3pr.hub.mongoC3prUri);

const events = (async () => {
    return (await client).db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoEventsCollection);
})();

async function insert(data) {
    return (await events).insertOne(data);
}

async function find(uuid) {
    return (await events).findOne({uuid});
}

async function markStatus(uuid, status) {
    await (await events).update(
        {uuid},
        {$set: {status}}
    );
}

function persistAsUnprocessed(uuid) {
    return markStatus(uuid, Status.UNPROCESSED);
}

function persistAsProcessing(uuid) {
    return markStatus(uuid, Status.PROCESSING);
}

function persistAsProcessed(uuid) {
    return markStatus(uuid, Status.PROCESSED);
}

module.exports = {
    insert,
    find,
    persistAsUnprocessed,
    persistAsProcessing,
    persistAsProcessed,
    close: async () => (await client).close(),
};