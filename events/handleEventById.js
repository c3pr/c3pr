"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG5_1 = require("node-c3pr-logger/c3prLOG5");
const collectEventAndMarkAsProcessing_1 = require("./collectEventAndMarkAsProcessing");
const markAs_1 = require("./markAs");
async function handleResult(handlerFunctionResult, { event, handlerFunction, c3prHubUrl, jwt }) {
    if (handlerFunctionResult.skipped) {
        c3prLOG5_1.default(`handlerFunction() returned skipped===true. We'll do nothing, then.`, { meta: { handlerFunction, event } });
        return null;
    }
    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleEventById> Handler function should return an object of format {new_status, result?} (only new_status is mandatory).
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }
    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            await markAs_1.markAsProcessed({ event_type: event.event_type, uuid: event.uuid, c3prHubUrl, jwt }, c3prLOG5_1.default).catch(error => {
                c3prLOG5_1.default(`Couldn't mark ${event.event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will ` +
                    `timeout and the event will be reprocessed, possibly generating duplicated effects.`, { error, meta: { handlerFunction, event } });
            });
            break;
        case 'UNPROCESSED':
            await markAs_1.markAsUnprocessed({ event_type: event.event_type, uuid: event.uuid, c3prHubUrl, jwt }, c3prLOG5_1.default).catch(error => {
                c3prLOG5_1.default(`Couldn't mark ${event.event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { error, meta: { handlerFunction, event } });
            });
            break;
        default:
            throw new Error(`<handleEventById> Handler function returned a new_status of unsupported value. 
            handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }
    return handlerFunctionResult.result;
}
// TODO document this can return null (not the result) when no event is collected OR when handlerFunction() returns skipped===true
async function handleEventById({ event_type, event_uuid, handlerFunction, c3prHubUrl, jwt }, c3prLOG5) {
    c3prLOG5 = c3prLOG5({ caller_name: 'handleEventById', euuid: event_uuid });
    c3prLOG5(`Handling by id ${event_type}::${event_uuid}.`);
    let event = await collectEventAndMarkAsProcessing_1.collectEventByIdAndMarkAsProcessing({ event_type, event_uuid, c3prHubUrl, jwt }, c3prLOG5);
    if (!event) {
        return;
    }
    c3prLOG5 = c3prLOG5({ euuid: event.uuid });
    try {
        let handlerFunctionResult = await handlerFunction(event, c3prLOG5);
        return handleResult(handlerFunctionResult, { event, handlerFunction, c3prHubUrl, jwt });
    }
    catch (error) {
        c3prLOG5(`Error while executing handlerFunction() for event handling.`, { error, meta: { handlerFunction, event } });
        markAs_1.markAsUnprocessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt }, c3prLOG5).catch(error => {
            c3prLOG5(`Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { error, meta: { handlerFunction, event } });
        });
        return;
    }
}
// noinspection JSUnusedGlobalSymbols
exports.default = handleEventById;
//# sourceMappingURL=handleEventById.js.map