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

function addAsProcessing(eventType, uuid) {
    let processingEventsOfType = EVENTS_PROCESSING.get(eventType) || new Map();
    processingEventsOfType.set(uuid, new Date().toISOString());
    EVENTS_PROCESSING.set(eventType, processingEventsOfType);
}

function removeAsProcessing(eventType, uuid) {
    let processingEventsOfType = EVENTS_PROCESSING.get(eventType) || new Map();
    if (!processingEventsOfType.has(uuid)) {
        throw new Error(`UUID ${uuid} of event type ${eventType} is not currently processing.`)
    }
    processingEventsOfType.delete(uuid);
}

function retrieveAllTimedOut(timeoutInMs) {
    let timedOut = [];
    let nowAsTimestamp = new Date().getTime();
    EVENTS_PROCESSING.forEach((eventMap, eventType) => {
        eventMap.forEach((isoDate, uuid) => {
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
    removeAsProcessing,
    addAsProcessing,
    peekUnprocessedEventOfType: peekUnprocessedEventOfType,
    retrieveAllTimedOut
});