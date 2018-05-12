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

function addAsUnprocessed(eventType, uuid) {
    let unprocessedEventsOfType = EVENTS_UNPROCESSED.get(eventType) || new Set();
    unprocessedEventsOfType.add(uuid);
    EVENTS_UNPROCESSED.set(eventType, unprocessedEventsOfType);
}

function addAsProcessing(eventType, uuid, processorUUID) {
    assert.ok(eventType && uuid && processorUUID);

    const processingEventsOfType = EVENTS_PROCESSING.get(eventType) || new Map();

    const processingEvent = processingEventsOfType.get(uuid);
    if (processingEvent && processingEvent.processorUUID !== processorUUID) {
        throw new Error(`Event of UUID '${uuid}' and type '${eventType}' is already being processed by processorUUID '${processingEvent.processorUUID}'. processorUUID you sent me: '${processorUUID}'.`)
    }

    processingEventsOfType.set(uuid, {dateTime: new Date().toISOString(), processorUUID});
    EVENTS_PROCESSING.set(eventType, processingEventsOfType);
}

function currentlyProcessing(eventType, uuid) {
    const processingEventsOfType = EVENTS_PROCESSING.get(eventType) || new Map();
    return processingEventsOfType.get(uuid);
}

function removeAsProcessing(eventType, uuid, processorUUID) {
    const processingEventsOfType = EVENTS_PROCESSING.get(eventType) || new Map();
    const processingEvent = processingEventsOfType.get(uuid);
    if (!processingEvent) {
        throw new Error(`Event of UUID '${uuid}' and type '${eventType}' is not currently being processed.`)
    }
    if (processingEvent.processorUUID !== processorUUID) {
        throw new Error(`Event of UUID '${uuid}' and type '${eventType}' is being processed by a different processorUUID ('${processingEvent.processorUUID}'), not the one you sent me ('${processorUUID}').`)
    }
    processingEventsOfType.delete(uuid);
}

function retrieveAllTimedOut(timeoutInMs) {
    let timedOut = [];
    let nowAsTimestamp = new Date().getTime();
    EVENTS_PROCESSING.forEach((eventMap, eventType) => {
        eventMap.forEach(({dateTime: isoDate}, uuid) => {
            let valueAsTimestamp = new Date(isoDate).getTime();
            let timePassed = nowAsTimestamp - valueAsTimestamp;
            if (timePassed > timeoutInMs) {
                timedOut.push({eventType, uuid});
            }
        });
    });
    return timedOut;
}

function peekUnprocessedEventOfType(eventType) {
    let unprocessedEventsOfType = EVENTS_UNPROCESSED.get(eventType) || new Set();
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