const MongoClient = require("mongodb").MongoClient;
const config = require('../../config');
const Status = require('./status');

const client = MongoClient.connect(config.c3pr.hub.mongoC3prUrl);

const events = (async () => {
    return (await client).db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoEventsCollection);
})();

async function insert(data) {
    return (await events).insertOne(data);
}

async function find(uuid) {
    return (await events).findOne({uuid});
}

async function findAll() {
    return (await events).find({}).toArray();
}

async function findAllOfType(event_type) {
    return (await events).find({event_type}).toArray();
}

async function markStatus(uuid, status, processorUUID) {
    return (await events).update(
        {uuid},
        {$set: {meta: {status, processorUUID}}}
    );
}

function persistAsUnprocessed(uuid, processorUUID) {
    return markStatus(uuid, Status.UNPROCESSED, processorUUID);
}

function persistAsProcessing(uuid, processorUUID) {
    return markStatus(uuid, Status.PROCESSING, processorUUID);
}

function persistAsProcessed(uuid, processorUUID) {
    return markStatus(uuid, Status.PROCESSED, processorUUID);
}

module.exports = {
    insert,
    find,
    findAll,
    findAllOfType,
    persistAsUnprocessed,
    persistAsProcessing,
    persistAsProcessed,
    close: async () => (await client).close(),
};