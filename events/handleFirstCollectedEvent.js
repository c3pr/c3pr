const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;

const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;
const markAsProcessed = require('./markAs').markAs.markAsProcessed;
const markAsUnprocessed = require('./markAs').markAs.markAsUnprocessed;

// TODO document this can return null (not the result) when no event is collected
async function handleFirstCollectedEvent({event_type, handlerFunction, c3prHubUrl, jwt}) {
    c3prLOG3(`Handling ${event_type}.`, {ids: ['pre-event']});

    let event;
    try {
        event = await collectEventAndMarkAsProcessing({event_type, c3prHubUrl, jwt});

        if (!event) {
            c3prLOG3(`No ${event_type} collected (possibly due to concurrent attempts to collect the same event and this instance was late). Skipping.`, {ids: ['pre-event'], meta: {event}});
            return;
        }
    } catch (error) {
        c3prLOG3(`Couldn't collect ${event_type}. Skipping.`, {ids: ['pre-event'], error});
        return;
    }

    let handlerFunctionResult;
    try {
        handlerFunctionResult = await handlerFunction(event);
    } catch (error) {
        c3prLOG3(`Error while executing handlerFunction() for event handling.`, {ids: [event.uuid], error, meta: {handlerFunction, event}});

        markAsUnprocessed({event_type, uuid: event.uuid, c3prHubUrl, jwt}).catch(error => {
            c3prLOG3(
                `Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`,
                {ids: [event.uuid], error, meta: {handlerFunction, event}}
            );
        });
        return;
    }

    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleFirstCollectedEvent> Handler function should return an object of format {new_status, result}, being new_status mandatory.
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }

    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            await markAsProcessed({event_type, uuid: event.uuid, c3prHubUrl, jwt}).catch(error => {
                c3prLOG3(
                    `Couldn't mark ${event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will `+
                    `timeout and the event will be reprocessed, possibly generating duplicated effects.`,
                    {ids: [event.uuid], error, meta: {handlerFunction, event}}
                );
            });
            break;
        case 'UNPROCESSED':
            await markAsUnprocessed({event_type, uuid: event.uuid, c3prHubUrl, jwt}).catch(error => {
                c3prLOG3(
                    `Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`,
                    {ids: [event.uuid], error, meta: {handlerFunction, event}}
                );
            });
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