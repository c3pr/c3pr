const assert = require('assert');

/*************************************************************************
 These functions are used to keep control of what UUIDs are under active
 processing or not.

 THERE MUST BE NO ASYNCHRONOUS CODE IN THESE FUNCTIONS.

 They exist exactly to prevend concurrent collection of events. Since
 no two collects should return the same event.

 *************************************************************************/

const EVENTS_UNPROCESSED = new Map();
const EVENTS_PROCESSING = new Map();

function addAsUnprocessed(event_type, uuid) {
    let unprocessedEventsOfType = EVENTS_UNPROCESSED.get(event_type) || new Set();
    unprocessedEventsOfType.add(uuid);
    EVENTS_UNPROCESSED.set(event_type, unprocessedEventsOfType);
}

function removeAsUnprocessed(event_type, uuid, skipPresenceCheck = false) {
    const unprocessedEventsOfType = EVENTS_UNPROCESSED.get(event_type) || new Set();
    if (!unprocessedEventsOfType.has(uuid) && !skipPresenceCheck) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is not currently with unprocessed status.`)
    }
    unprocessedEventsOfType.delete(uuid);
}

function addAsProcessing(event_type, uuid, processor_uuid) {
    assert.ok(event_type && uuid && processor_uuid);

    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();

    const processingEvent = processingEventsOfType.get(uuid);
    if (processingEvent && processingEvent.processor_uuid !== processor_uuid) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is already being processed by processor_uuid '${processingEvent.processor_uuid}'. processor_uuid you sent me: '${processor_uuid}'.`)
    }
    if (!processingEvent) {
        removeAsUnprocessed(event_type, uuid);
    }

    processingEventsOfType.set(uuid, {dateTime: new Date().toISOString(), processor_uuid});
    EVENTS_PROCESSING.set(event_type, processingEventsOfType);
}

function currentlyProcessing(event_type, uuid) {
    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();
    return processingEventsOfType.get(uuid);
}

const REPROCESS = '<REPROCESS>';

function removeAsProcessing(event_type, uuid, processor_uuid) {
    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();
    const processingEvent = processingEventsOfType.get(uuid);
    if (!processingEvent && processor_uuid === REPROCESS) {
        return;
    }
    if (!processingEvent) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is not currently being processed.`)
    }
    if (processor_uuid !== '<TIMED_OUT>' && processor_uuid !== REPROCESS && processingEvent.processor_uuid !== processor_uuid) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is being processed by a different processor_uuid ('${processingEvent.processor_uuid}'), not the one you sent me ('${processor_uuid}').`)
    }
    processingEventsOfType.delete(uuid);
}

function markForReprocessing(event_type, uuid) {
    removeAsProcessing(event_type, uuid, REPROCESS);
    removeAsUnprocessed(event_type, uuid, true);
    addAsUnprocessed(event_type, uuid);
}

function retrieveAllTimedOut(timeoutInMs) {
    let timedOut = [];
    let nowAsTimestamp = new Date().getTime();
    EVENTS_PROCESSING.forEach((eventMap, event_type) => {
        eventMap.forEach(({dateTime: isoDate}, uuid) => {
            let valueAsTimestamp = new Date(isoDate).getTime();
            let timePassed = nowAsTimestamp - valueAsTimestamp;
            if (timePassed > timeoutInMs) {
                timedOut.push({event_type, uuid});
            }
        });
    });
    return timedOut;
}

function peekUnprocessedEventOfType(event_type) {
    let unprocessedEventsOfType = EVENTS_UNPROCESSED.get(event_type) || new Set();
    const {value: uuid} = unprocessedEventsOfType.values().next();
    return uuid;
}

function getEventTypesWithUnprocessedEvents() {
    return EVENTS_UNPROCESSED.keys();
}

export = Object.freeze({
    UNPROCESSED: 'UNPROCESSED',
    PROCESSING: 'PROCESSING',
    PROCESSED: 'PROCESSED',
    addAsUnprocessed,
    currentlyProcessing,
    removeAsProcessing,
    addAsProcessing,
    peekUnprocessedEventOfType,
    retrieveAllTimedOut,
    getEventTypesWithUnprocessedEvents,
    markForReprocessing
});