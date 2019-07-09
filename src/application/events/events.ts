import {c3prBusEmit, c3prBusOnNewSubscribers} from "../bus/bus";

import i_c3prLOG5 from "node-c3pr-logger/c3prLOG5";
// @ts-ignore
const c3prLOG5 = i_c3prLOG5({service_name: 'c3pr-hub'});

const config = require('../../config');

const uuidv4 = require('uuid/v4');
const eventsDB = require('./eventsDB');
import Status from './status';
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

    c3prBusEmit(event_type, {uuid, payload});

    return uuid;
}

async function reprocessParents(event_type) {
    assert.ok(event_type, "Missing required argument: event_type");
    const REPROCESS_PROCESSOR_UUID = `<REPROCESS> at ${new Date().toISOString()}`;
    let events = await findAll({event_type, "meta.status": Status.UNPROCESSED});
    for(let e of events) {
        await patchAsProcessing(e.event_type, e.uuid, REPROCESS_PROCESSOR_UUID);
        let parentUUID = e.payload.parent.uuid;

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

async function peekUnprocessed(event_type) {
    assert.ok(event_type, "event_type is required");
    const unprocessedEventOfType = await eventsDB.findAll({'meta.status': Status.UNPROCESSED, event_type});
    let first = unprocessedEventOfType[0];
    if (!first) {
        return Promise.resolve(null);
    }
    return eventsDB.find(first.uuid);
}

function patchAsProcessing(event_type, uuid, processor_uuid) {
    assert.ok(event_type && uuid && processor_uuid, "Missing required arguments");
    return eventsDB.persistAsProcessing(uuid, processor_uuid);
}

async function patchAsProcessed(event_type, uuid, processor_uuid) {
    return eventsDB.persistAsProcessed(uuid, processor_uuid);
}

function patchAsUnprocessed(event_type, uuid, processor_uuid?) {
    return eventsDB.persistAsUnprocessed(uuid, processor_uuid);
}

async function broadcastUnprocessedEvents() {
    const _c3prLOG5 = c3prLOG5({sha: '!hub-events-broadcast-unprocessed-events', caller_name: 'broadcastUnprocessedEvents'});
    let unprocessedEvents = await eventsDB.findAllOfStatus(Status.UNPROCESSED);
    unprocessedEvents = unprocessedEvents.filter(({event_type}) => !event_type.includes('Failed'));
    _c3prLOG5('Broadcasting now. '+unprocessedEvents.length+' unprocessed events.', {meta: {unprocessedEvents}});
    for (let event_payload of unprocessedEvents) {
        const event_type = event_payload.event_type;
        _c3prLOG5('Fetched ' + event_payload.uuid + ' for ' + event_type + ". Emitting.", {meta: {event_type, event_payload}, lcid: event_payload.uuid, euuid: event_payload.uuid});
        c3prBusEmit(event_type, event_payload);
    }
}

async function initializeEventsOnStartup() {
    const _c3prLOG5 = c3prLOG5({sha: '!hub-events-initialize-on-startup'});
    _c3prLOG5('Initializing events status database.');

    const previouslyUnprocessedEvents = await eventsDB.findAllOfStatus(Status.UNPROCESSED);

    const previouslyProcessingEvents = await eventsDB.findAllOfStatus(Status.PROCESSING);
    previouslyProcessingEvents.forEach(({event_type, uuid}) => eventsDB.persistAsUnprocessed(uuid));

    const previouslyUnprocessedEventTypes = Array.from(new Set(previouslyUnprocessedEvents.map(e => e.event_type)));
    _c3prLOG5(
        `Initialization complete. Previously UNPROCESSED events: ${previouslyUnprocessedEvents.length} [${previouslyUnprocessedEventTypes}]. Previously PROCESSING events: ${previouslyProcessingEvents.length}`,
        {meta: {previouslyUnprocessedEvents}}
    );

    /**
     * Marks as UNPROCESSED all events that have status = PROCESSING for longer than config.c3pr.hub.uncollectTimeoutInMs.
     */
    setTimeout(async () => {
        const allTimedOut = await eventsDB.findAll({"meta.modified" : { $lte : new Date(Date.now() - config.c3pr.hub.uncollectTimeoutInMs)}});
        allTimedOut.forEach(({event_type, uuid}) => patchAsUnprocessed(event_type, uuid, 'uncollect-timeout'))
    }, config.c3pr.hub.uncollectPollingInMs).unref();

    setInterval(broadcastUnprocessedEvents, config.c3pr.hub.broadcastIntervalInMs).unref();

    // no good in broadcasting right now, as there most probably won't exist no node connected to this new instance of the HUB
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
    reprocessParents,
    broadcastUnprocessedEvents
};

