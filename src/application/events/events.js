const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');
const assert = require('assert');

const c3prBus = require('../../application/bus/bus').c3prBus;
c3prBus.onNewSubscribers((event_type) => {
    let uuid = Status.peekUnprocessedEventOfType(event_type);
    if (uuid) {
        return c3prBus.emit(event_type);
    }
});

async function register(event_type, payload) {
    assert.ok(event_type && payload, "Missing required arguments");
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, event_type, meta: {status, processor_uuid: null, created: new Date().toISOString()}, payload});
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

function findAllOfType(event_type, query) {
    assert.ok(event_type, "event_type is required");
    return eventsDB.findAllOfType(event_type, query);
}

function peekUnprocessed(event_type) {
    assert.ok(event_type, "event_type is required");
    let uuid = Status.peekUnprocessedEventOfType(event_type);
    if (!uuid) {
        return Promise.resolve(null);
    }
    return eventsDB.find(uuid);
}

function patchAsProcessing(event_type, uuid, processor_uuid) {
    assert.ok(event_type && uuid && processor_uuid, "Missing required arguments");
    Status.addAsProcessing(event_type, uuid, processor_uuid);
    return eventsDB.persistAsProcessing(uuid, processor_uuid);
}

/**
 * If the uuid is not at EVENTS_PROCESSING, it errors.
 */
async function patchAsProcessed(event_type, uuid, processor_uuid) {
    assert.ok(event_type && uuid && processor_uuid, "Missing required arguments");
    if (!Status.currentlyProcessing(event_type, uuid)) {
        let evt = await eventsDB.find(uuid);
        if (!evt) {
            throw new Error(`Event of UUID '${uuid}' and type '${event_type}' doesn't exist.`)
        }
        if (evt.meta.status === Status.PROCESSED && evt.meta.processor_uuid === processor_uuid) {
            return;
        }
        if (evt.meta.status === Status.PROCESSED && evt.meta.processor_uuid !== processor_uuid) {
            throw new Error(`Event of UUID '${uuid}' and type '${event_type}' has been processed by a different processor_uuid: ${evt.meta.processor_uuid}. processor_uuid you sent me: ${processor_uuid}.`)
        }
    }
    Status.removeAsProcessing(event_type, uuid, processor_uuid);
    return eventsDB.persistAsProcessed(uuid, processor_uuid);
}

// noinspection JSUnusedLocalSymbols
function patchAsUnprocessed(event_type, uuid, processor_uuid) {
    // TODO maybe only mark it as unprocessed if processor_uuid is the same (this makes sense when we call this function from the controller. don't know if it makes sense for the other places)
    assert.ok(event_type && uuid, "Missing required arguments");
    Status.removeAsProcessing(event_type, uuid, '<TIMED_OUT>');
    Status.addAsUnprocessed(event_type, uuid);
    return eventsDB.persistAsUnprocessed(uuid);
}

const logMetas = [{nodeName: 'c3pr-hub', moduleName: 'events'}];

async function initializeEventsOnStartup() {
    c3prLOG2({
        msg: 'Initializing events status database.', logMetas
    });
    const previouslyUnprocessedEvents = await eventsDB.findAllOfStatus(Status.UNPROCESSED);
    previouslyUnprocessedEvents.forEach(({event_type, uuid}) => Status.addAsUnprocessed(event_type, uuid));

    const previouslyProcessingEvents = await eventsDB.findAllOfStatus(Status.PROCESSING);
    previouslyProcessingEvents.forEach(({event_type, uuid}) => {
        Status.addAsUnprocessed(event_type, uuid);
        // noinspection JSIgnoredPromiseFromCall
        eventsDB.persistAsUnprocessed(uuid);
    });
    c3prLOG2({
        msg: `Initialization complete. Previously UNPROCESSED events: ${previouslyUnprocessedEvents.length}. Previously PROCESSING events: ${previouslyProcessingEvents.length}`, logMetas
    });

    /**
     * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
     */
    setTimeout(() => {
        const allTimedOut = Status.retrieveAllTimedOut(config.c3pr.hub.uncollectTimeoutInMs);
        allTimedOut.forEach(({event_type, uuid}) => patchAsUnprocessed(event_type, uuid))
    }, config.c3pr.hub.uncollectPollingInMs).unref();
}

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

initializeEventsOnStartup().catch(e => c3prLOG2({msg: 'Error on initializing events on startup.', logMetas, meta: {e}}));