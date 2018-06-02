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

async function findAllOfType(event_type, query) {
    return (await events).find({event_type, ...(query||{})}).toArray();
}

async function findAllOfStatus(status) {
    return (await events).find({'meta.status': status}).toArray();
}

async function markStatus(uuid, status, processor_uuid) {
    return (await events).update(
        {uuid},
        {$set: {'meta.status': status, 'meta.processor_uuid': processor_uuid, 'meta.modified': new Date().toISOString()}}
    );
}

function persistAsUnprocessed(uuid) {
    return markStatus(uuid, Status.UNPROCESSED, null);
}

function persistAsProcessing(uuid, processor_uuid) {
    return markStatus(uuid, Status.PROCESSING, processor_uuid);
}

function persistAsProcessed(uuid, processor_uuid) {
    return markStatus(uuid, Status.PROCESSED, processor_uuid);
}

module.exports = {
    insert,
    find,
    findAll,
    findAllOfType,
    findAllOfStatus,
    persistAsUnprocessed,
    persistAsProcessing,
    persistAsProcessed,
    close: async () => (await client).close(),
};