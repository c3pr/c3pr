const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');
const assert = require('assert');

async function register(eventType, payload) {
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, eventType, dateTime: new Date().toISOString(), payload});
    Status.addAsUnprocessed(eventType, uuid);

    return uuid;
}

function find(uuid) {
    assert.ok(uuid, "uuid is required");
    return eventsDB.find(uuid);
}

function peekUnprocessed(eventType) {
    let uuid = Status.peekUnprocessedEventOfType(eventType);
    if (!uuid) {
        return null;
    }
    return eventsDB.find(uuid);
}

function patchAsProcessing(eventType, uuid) {
    assert.ok(eventType, "eventType is required");
    assert.ok(uuid, "uuid is required");
    Status.addAsProcessing(eventType, uuid);
    return eventsDB.persistAsProcessing(uuid);
}

/**
 * If the uuid is not at EVENTS_PROCESSING, it errors.
 */
function patchAsProcessed(eventType, uuid) {
    assert.ok(eventType, "eventType is required");
    assert.ok(uuid, "uuid is required");
    Status.removeAsProcessing(eventType, uuid);
    return eventsDB.persistAsProcessed(uuid);
}

/**
 * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
 */
setTimeout(() => {
    const allTimedOut = Status.retrieveAllTimedOut(config.c3pr.hub.uncollectTimeoutInMs);
    allTimedOut.forEach(({eventType, uuid}) => {
        Status.removeAsProcessing(eventType, uuid);
        Status.addAsUnprocessed(eventType, uuid);
        eventsDB.persistAsUnprocessed(uuid);
    })
}, config.c3pr.hub.uncollectPollingInMs).unref();



module.exports = {
    register,
    find,
    peekUnprocessed,
    patchAsProcessing,
    patchAsProcessed
};