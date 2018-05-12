const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');
const assert = require('assert');

async function register(eventType, payload) {
    assert.ok(eventType && payload, "Missing required arguments");
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, eventType, meta: {status, processor: null, dateTime: new Date().toISOString()}, payload});
    Status.addAsUnprocessed(eventType, uuid);

    return uuid;
}

function find(uuid) {
    assert.ok(uuid, "uuid is required");
    return eventsDB.find(uuid);
}

function peekUnprocessed(eventType) {
    assert.ok(eventType, "eventType is required");
    let uuid = Status.peekUnprocessedEventOfType(eventType);
    if (!uuid) {
        return null;
    }
    return eventsDB.find(uuid);
}

function patchAsProcessing(eventType, uuid, processorUUID) {
    assert.ok(eventType && uuid && processorUUID, "Missing required arguments");
    Status.addAsProcessing(eventType, uuid, processorUUID);
    return eventsDB.persistAsProcessing(uuid, processorUUID);
}

/**
 * If the uuid is not at EVENTS_PROCESSING, it errors.
 */
async function patchAsProcessed(eventType, uuid, processorUUID) {
    assert.ok(eventType && uuid && processorUUID, "Missing required arguments");
    if (!Status.currentlyProcessing(eventType, uuid)) {
        let evt = await eventsDB.find(uuid);
        if (evt.meta.status === Status.PROCESSED && evt.meta.processorUUID === processorUUID) {
            return;
        }
        if (evt.meta.status === Status.PROCESSED && evt.meta.processorUUID !== processorUUID) {
            throw new Error(`Event of UUID '${uuid}' and type '${eventType}' has been processed by a different processorUUID: ${evt.meta.processorUUID}. processorUUID you sent me: ${processorUUID}.`)
        }
    }
    Status.removeAsProcessing(eventType, uuid, processorUUID);
    return eventsDB.persistAsProcessed(uuid, processorUUID);
}

function patchAsUnprocessed(eventType, uuid) {
    assert.ok(eventType && uuid, "Missing required arguments");
    Status.removeAsProcessing(eventType, uuid, '<TIMED_OUT>');
    Status.addAsUnprocessed(eventType, uuid);
    return eventsDB.persistAsUnprocessed(uuid, null);
}

/**
 * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
 */
setTimeout(() => {
    const allTimedOut = Status.retrieveAllTimedOut(config.c3pr.hub.uncollectTimeoutInMs);
    allTimedOut.forEach(({eventType, uuid}) => patchAsUnprocessed(eventType, uuid))
}, config.c3pr.hub.uncollectPollingInMs).unref();



module.exports = {
    register,
    find,
    peekUnprocessed,
    patchAsProcessing,
    patchAsProcessed,
    patchAsUnprocessed
};