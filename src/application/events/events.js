const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');
const assert = require('assert');

const c3prBus = require('../../application/bus/bus').c3prBus;

async function register(event_type, payload) {
    assert.ok(event_type && payload, "Missing required arguments");
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, event_type, meta: {status, processor: null, dateTime: new Date().toISOString()}, payload});
    Status.addAsUnprocessed(event_type, uuid);

    c3prBus.emit(event_type);

    return uuid;
}

function find(uuid) {
    assert.ok(uuid, "uuid is required");
    return eventsDB.find(uuid);
}

function findAll() {
    return eventsDB.findAll();
}

function findAllOfType(event_type) {
    assert.ok(event_type, "event_type is required");
    return eventsDB.findAllOfType(event_type);
}

function peekUnprocessed(event_type) {
    assert.ok(event_type, "event_type is required");
    let uuid = Status.peekUnprocessedEventOfType(event_type);
    if (!uuid) {
        return Promise.resolve(null);
    }
    return eventsDB.find(uuid);
}

function patchAsProcessing(event_type, uuid, processorUUID) {
    assert.ok(event_type && uuid && processorUUID, "Missing required arguments");
    Status.addAsProcessing(event_type, uuid, processorUUID);
    return eventsDB.persistAsProcessing(uuid, processorUUID);
}

/**
 * If the uuid is not at EVENTS_PROCESSING, it errors.
 */
async function patchAsProcessed(event_type, uuid, processorUUID) {
    assert.ok(event_type && uuid && processorUUID, "Missing required arguments");
    if (!Status.currentlyProcessing(event_type, uuid)) {
        let evt = await eventsDB.find(uuid);
        if (evt.meta.status === Status.PROCESSED && evt.meta.processorUUID === processorUUID) {
            return;
        }
        if (evt.meta.status === Status.PROCESSED && evt.meta.processorUUID !== processorUUID) {
            throw new Error(`Event of UUID '${uuid}' and type '${event_type}' has been processed by a different processorUUID: ${evt.meta.processorUUID}. processorUUID you sent me: ${processorUUID}.`)
        }
    }
    Status.removeAsProcessing(event_type, uuid, processorUUID);
    return eventsDB.persistAsProcessed(uuid, processorUUID);
}

function patchAsUnprocessed(event_type, uuid) {
    assert.ok(event_type && uuid, "Missing required arguments");
    Status.removeAsProcessing(event_type, uuid, '<TIMED_OUT>');
    Status.addAsUnprocessed(event_type, uuid);
    return eventsDB.persistAsUnprocessed(uuid, null);
}

/**
 * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
 */
setTimeout(() => {
    const allTimedOut = Status.retrieveAllTimedOut(config.c3pr.hub.uncollectTimeoutInMs);
    allTimedOut.forEach(({event_type, uuid}) => patchAsUnprocessed(event_type, uuid))
}, config.c3pr.hub.uncollectPollingInMs).unref();



module.exports = {
    register,
    find,
    findAll,
    findAllOfType,
    peekUnprocessed,
    patchAsProcessing,
    patchAsProcessed,
    patchAsUnprocessed
};