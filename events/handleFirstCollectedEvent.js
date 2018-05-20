const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const collectEventAndMarkAsProcessing = require('node-c3pr-hub-client/events/collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;
const markAsProcessed = require('node-c3pr-hub-client/events/markAsProcessed').markAsProcessed.markAsProcessed;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'handleFirstCollectedEvent'};

async function handleFirstCollectedEvent({event_type, handlerFunction, c3prHubUrl, jwt, logMetas: outerLogMetas}) {
    const logMetas = [...(outerLogMetas || []), logMeta];

    c3prLOG2({msg: `Handling ${event_type}.`, logMetas});

    let event;
    try {
        event = await collectEventAndMarkAsProcessing({event_type, c3prHubUrl, jwt, logMetas})
    } catch (e) {
        c3prLOG2({
            msg: `Couldn't collect ${event_type}. Skipping. Error reason: '${e}'. Data: ${e.response && e.response.data}.`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
        return;
    }

    try {
        if (!event) {
            c3prLOG2({
                msg: `No ${event_type} collected (possibly due to concurrent attempts to collect the same event and this instance was late). Skipping.`,
                logMetas,
                meta: {event}
            });
            return;
        }

        await handlerFunction(event);

    } catch (e) {
        c3prLOG2({
            msg: `Error while executing handlerFunction() for event handling. Reason: '${e}'. Data: ${e.response && e.response.data}.`,
            logMetas,
            meta: {event, error: require('util').inspect(e)}
        });
        // TODO UNCOLLECT HERE! If not uncollected, the PROCESSING status will timeout anyway, though.
        return;
    }

    try {
        await markAsProcessed({event_type, uuid: event.uuid, c3prHubUrl, jwt, logMetas});
    } catch (e) {
        c3prLOG2({
            msg: `Couldn't mark ${event_type}/${event.uuid} as COMPLETED. You must do it **MANUALLY**. If you don't, the PROCESSING status will `+
                `timeout and the event will be reprocessed, possibly generating duplicated effects. Error reason: '${e}'. Data: ${e.response && e.response.data}.`,
            logMetas,
            meta: {event, error: require('util').inspect(e)}
        });
    }

}

module.exports = {
    handleFirstCollectedEvent: {
        handleFirstCollectedEvent
    }
};