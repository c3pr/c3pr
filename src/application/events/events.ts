import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import {c3prBusEmit, c3prBusOnNewSubscribers} from "../bus/bus";

const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
const Status = require('./status');
const assert = require('assert');

c3prBusOnNewSubscribers(async (event_type) => {
    let event = await peekUnprocessed(event_type);
    if (event) {
        return c3prBusEmit(event_type, event);
    }
});

async function register(event_type, payload) {
    assert.ok(event_type && payload, "Missing required arguments");
    let uuid = uuidv4();
    let status = Status.UNPROCESSED;

    await eventsDB.insert({uuid, event_type, meta: {status, processor_uuid: null, created: new Date().toISOString()}, payload});
    Status.addAsUnprocessed(event_type, uuid);

    c3prBusEmit(event_type, {uuid, payload});

    return uuid;
}

async function reprocessParents(event_type) {
    assert.ok(event_type, "Missing required argument: event_type");
    const REPROCESS_PROCESSOR_UUID = `<REPROCESS> at ${new Date().toISOString()}`;
    let events = await findAll({event_type, "meta.status": Status.UNPROCESSED});
    for(let e of events) {
        await patchAsProcessing(e.event_type, e.uuid, REPROCESS_PROCESSOR_UUID);
        let parentEventType = e.payload.parent.event_type;
        let parentUUID = e.payload.parent.uuid;

        Status.markForReprocessing(parentEventType, parentUUID, '<REPROCESS>');
        await eventsDB.persistAsUnprocessed(parentUUID);

        const sha = (e.payload.repository && e.payload.repository.revision) || 'unknown';
        const _c3prLOG5 = c3prLOG5({sha});
        _c3prLOG5(`Event patched as processed due to request to reprocess its parents.`, {euuid: e.uuid});
        _c3prLOG5(`Event patched as unprocessed due to request to reprocess the child event.`, {euuid: parentUUID, meta: {childEventType: e.event_type, childUUID: e.uuid}});
        await patchAsProcessed(e.event_type, e.uuid, REPROCESS_PROCESSOR_UUID);
    }
}

function find(uuid) {
    assert.ok(uuid, "uuid is required");
    return eventsDB.find(uuid);
}

function findAll(query) {
    return eventsDB.findAll(query);
}

function analyticsPerProjectEventCountOfType(event_type) {
    assert.ok(event_type, "event_type is required");
    return eventsDB.perProjectEventCountOfType(event_type);
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

async function initializeEventsOnStartup() {
    const _c3prLOG5 = c3prLOG5({sha: '!hub-events-initialize-on-startup'});
    _c3prLOG5('Initializing events status database.');

    const previouslyUnprocessedEvents = await eventsDB.findAllOfStatus(Status.UNPROCESSED);
    previouslyUnprocessedEvents.forEach(({event_type, uuid}) => Status.addAsUnprocessed(event_type, uuid));

    const previouslyProcessingEvents = await eventsDB.findAllOfStatus(Status.PROCESSING);
    previouslyProcessingEvents.forEach(({event_type, uuid}) => {
        Status.addAsUnprocessed(event_type, uuid);
        // noinspection JSIgnoredPromiseFromCall
        eventsDB.persistAsUnprocessed(uuid);
    });
    const previouslyUnprocessedEventTypes = Array.from(new Set(previouslyUnprocessedEvents.map(e => e.event_type)));
    _c3prLOG5(
        `Initialization complete. Previously UNPROCESSED events: ${previouslyUnprocessedEvents.length} [${previouslyUnprocessedEventTypes}]. Previously PROCESSING events: ${previouslyProcessingEvents.length}`,
        {meta: {previouslyUnprocessedEvents}}
    );

    /**
     * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
     */
    setTimeout(() => {
        const allTimedOut = Status.retrieveAllTimedOut(config.c3pr.hub.uncollectTimeoutInMs);
        allTimedOut.forEach(({event_type, uuid}) => patchAsUnprocessed(event_type, uuid, 'uncollect-timeout'))
    }, config.c3pr.hub.uncollectPollingInMs).unref();



    setInterval(async () => {
        const eventTypesWithUnprocessedEvents = Status.getEventTypesWithUnprocessedEvents();
        for (let event_type of eventTypesWithUnprocessedEvents) {
            const event_payload = await peekUnprocessed(event_type);
            c3prBusEmit(event_type, event_payload);
        }
    }, config.c3pr.hub.broadcastIntervalInMs).unref();
}

export = {
    init: initializeEventsOnStartup().catch(error => c3prLOG5('Error on initializing events on startup.', {sha: '!hib-events-error-init', error})),
    register,
    find,
    findAll,
    findAllOfType,
    peekUnprocessed,
    patchAsProcessing,
    patchAsProcessed,
    patchAsUnprocessed,
    analyticsPerProjectEventCountOfType,
    reprocessParents
};

