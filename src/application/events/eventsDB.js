const config = require('../../config');
const Status = require('./status');

const client = require('../../infrastructure/db');



const events = (async () => {
    return (await client).db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoEventsCollection);
})();

async function insert(data) {
    return (await events).insertOne(data);
}

async function find(uuid) {
    return (await events).findOne({uuid});
}

async function findAll(query = {}) {
    return (await events).find(query).toArray();
}

async function perProjectEventCountOfType(event_type) {
    return (await events).aggregate([
        {$match: {event_type}},
        {$group: {_id: {project_uuid: "$payload.project_uuid"}, count: {$sum: 1}, last_modified: {$max: "$meta.modified"}}},
    ]).toArray();
}

function findAllOfType(event_type, query) {
    return findAll({event_type, ...(query||{})});
}

function findAllOfStatus(status) {
    return findAll({'meta.status': status});
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
    perProjectEventCountOfType,
    close: async () => (await client).close(),
};