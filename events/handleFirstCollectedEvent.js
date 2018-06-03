const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;
const markAsProcessed = require('./markAs').markAs.markAsProcessed;
const markAsUnprocessed = require('./markAs').markAs.markAsUnprocessed;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'handleFirstCollectedEvent'};

async function handleFirstCollectedEvent({event_type, handlerFunction, c3prHubUrl, jwt, logMetas: outerLogMetas}) {
    const logMetas = [...(outerLogMetas || []), logMeta];

    c3prLOG2({msg: `Handling ${event_type}.`, logMetas});

    let event;
    try {
        event = await collectEventAndMarkAsProcessing({event_type, c3prHubUrl, jwt, logMetas})
    } catch (error) {
        c3prLOG2({msg: `Couldn't collect ${event_type}. Skipping.`, logMetas, error});
        return;
    }

    let handlerFunctionResult;
    try {
        if (!event) {
            c3prLOG2({
                msg: `No ${event_type} collected (possibly due to concurrent attempts to collect the same event and this instance was late). Skipping.`,
                logMetas,
                meta: {event}
            });
            return;
        }

        handlerFunctionResult = await handlerFunction(event);

    } catch (error) {
        c3prLOG2({msg: `Error while executing handlerFunction() for event handling.`, logMetas, error});

        try {
            await markAsUnprocessed({event_type, uuid: event.uuid, c3prHubUrl, jwt, logMetas});
        } catch (error) {
            c3prLOG2({msg: `Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING `+
                    `status times out.`, logMetas, error});
        }
        return;
    }

    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleFirstCollectedEvent> Handler function should return an object of format {new_status, result}, being new_status mandatory.
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }

    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            try {
                await markAsProcessed({event_type, uuid: event.uuid, c3prHubUrl, jwt, logMetas});
            } catch (error) {
                c3prLOG2({msg: `Couldn't mark ${event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will `+
                        `timeout and the event will be reprocessed, possibly generating duplicated effects.`, logMetas, error});
            }
            break;
        case 'UNPROCESSED':
            try {
                await markAsUnprocessed({event_type, uuid: event.uuid, c3prHubUrl, jwt, logMetas});
            } catch (error) {
                c3prLOG2({msg: `Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING `+
                        `status times out.`, logMetas, error});
            }
            break;
        default:
            throw new Error(`<handleFirstCollectedEvent> Handler function returned a new_status of unsupported value. 
            handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }

    return handlerFunctionResult.result;
}

module.exports = {
    handleFirstCollectedEvent: {
        handleFirstCollectedEvent
    }
};