const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');

async function register(eventType, payload) {
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, status, eventType, dateTime: new Date().toISOString(), payload});
    Status.addAsUnprocessed(eventType, uuid);
}

async function collect(eventType) {
    let uuid = Status.unshiftUnprocessedEventOfType(eventType);
    if (!uuid) {
        return null;
    }

    Status.addAsProcessing(eventType, uuid);
    await eventsDB.persistAsProcessing(uuid);

    return eventsDB.find(uuid);
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

/**
 * - Gets the uuid from EVENTS_PROCESSING
 * - If not there, errors
 * - If there, marks the event as processed, removes the uuid from EVENTS_PROCESSING
 */
async function complete(eventType, uuid) {
    Status.removeAsProcessing(eventType, uuid);
    return eventsDB.persistAsProcessed(uuid);
}

module.exports = {
    register,
    collect,
    complete
};