const config = require('../../config');
import Status from './status';

const client = require('../../infrastructure/db');
import {Mutex} from 'await-semaphore';



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
    return (await events).find(query).sort({'meta.created': 1, 'timestamp': 1}).toArray();
}

async function perProjectEventCountOfType(event_type) {
    if (event_type === 'ChangesCommitted') {
        return (await events).aggregate([
            {$match: {event_type}},
            {$group: {_id: {project_uuid: "$payload.project_uuid"}, count: {$sum: 1}, last_modified: {$max: "$meta.modified"}}},
        ]).toArray();
    }
    return (await events).aggregate([
        {$match: {event_type}},
        {$group: {_id: {project_url: "$payload.repository.clone_url_http"}, count: {$sum: 1}, last_modified: {$max: "$meta.modified"}}},
    ]).toArray();
}

function findAllOfType(event_type, query) {
    return findAll({event_type, ...query});
}

function findAllOfStatus(status) {
    return findAll({'meta.status': status});
}



const eventStatusMutex = new Mutex();
async function markStatus(uuid, status, processor_uuid) {
    return (await events).update(
        {uuid},
        {$set: {'meta.status': status, 'meta.processor_uuid': processor_uuid, 'meta.modified': new Date().toISOString()}}
    );
}

function persistAsUnprocessed(uuid, processor_uuid) {
    return eventStatusMutex.use(() => markStatus(uuid, Status.UNPROCESSED, processor_uuid));
}

async function persistAsProcessing(uuid, processor_uuid) {
    return eventStatusMutex.use(async () => {
        const event = await find(uuid);
        if (event.meta.status !== Status.UNPROCESSED) {
            throw new Error(`Event ${uuid} was not UNPROCESSED. Attempt to mark as PROCESSING by ${processor_uuid} failed.`)
        }
        return markStatus(uuid, Status.PROCESSING, processor_uuid);
    });
}

async function persistAsProcessed(uuid, processor_uuid) {
    return eventStatusMutex.use(async () => {
        const event = await find(uuid);
        if (event.meta.status !== Status.PROCESSING) {
            throw new Error(`Event ${uuid} was not PROCESSING. Attempt to mark as PROCESSED by ${processor_uuid} failed.`)
        }
        if (event.meta.processor_uuid !== processor_uuid) {
            throw new Error(`Attempt to mark ${uuid} as PROCESSED by ${processor_uuid} when it has been previously marked as PROCESSING by ${event.meta.processor_uuid}.`)
        }
        return markStatus(uuid, Status.PROCESSED, processor_uuid);
    });
}

export = {
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