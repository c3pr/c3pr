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

function removeAsUnprocessed(event_type, uuid) {
    const unprocessedEventsOfType = EVENTS_UNPROCESSED.get(event_type) || new Set();
    if (!unprocessedEventsOfType.has(uuid)) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is not currently with unprocessed status.`)
    }
    unprocessedEventsOfType.delete(uuid);
}

function addAsProcessing(event_type, uuid, processorUUID) {
    assert.ok(event_type && uuid && processorUUID);

    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();

    const processingEvent = processingEventsOfType.get(uuid);
    if (processingEvent && processingEvent.processorUUID !== processorUUID) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is already being processed by processorUUID '${processingEvent.processorUUID}'. processorUUID you sent me: '${processorUUID}'.`)
    }
    if (!processingEvent) {
        removeAsUnprocessed(event_type, uuid);
    }

    processingEventsOfType.set(uuid, {dateTime: new Date().toISOString(), processorUUID});
    EVENTS_PROCESSING.set(event_type, processingEventsOfType);
}

function currentlyProcessing(event_type, uuid) {
    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();
    return processingEventsOfType.get(uuid);
}

function removeAsProcessing(event_type, uuid, processorUUID) {
    const processingEventsOfType = EVENTS_PROCESSING.get(event_type) || new Map();
    const processingEvent = processingEventsOfType.get(uuid);
    if (!processingEvent) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is not currently being processed.`)
    }
    if (processorUUID !== '<TIMED_OUT>' && processingEvent.processorUUID !== processorUUID) {
        throw new Error(`Event of UUID '${uuid}' and type '${event_type}' is being processed by a different processorUUID ('${processingEvent.processorUUID}'), not the one you sent me ('${processorUUID}').`)
    }
    processingEventsOfType.delete(uuid);
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

module.exports = Object.freeze({
    UNPROCESSED: 'UNPROCESSED',
    PROCESSING: 'PROCESSING',
    PROCESSED: 'PROCESSED',
    addAsUnprocessed,
    currentlyProcessing,
    removeAsProcessing,
    addAsProcessing,
    peekUnprocessedEventOfType,
    retrieveAllTimedOut
});