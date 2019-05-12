"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG5_1 = require("node-c3pr-logger/c3prLOG5");
const collectEventAndMarkAsProcessing_1 = require("./collectEventAndMarkAsProcessing");
const markAs_1 = require("./markAs");
function generateLogFunction(__c3prLOG5, outerLCID, outerSHA, outerEUUID) {
    if (__c3prLOG5) {
        return __c3prLOG5;
    }
    return c3prLOG5_1.default({ lcid: outerLCID, sha: outerSHA || '!handle-first-event', ...(outerEUUID && { euuid: outerEUUID }) });
}
// TODO document this can return null (not the result) when no event is collected
async function handleFirstCollectedEvent({ event_type, handlerFunction, c3prHubUrl, jwt, lcid: outerLCID, sha: outerSHA, euuid: outerEUUID }, __c3prLOG5) {
    let _c3prLOG5 = generateLogFunction(__c3prLOG5, outerLCID, outerSHA, outerEUUID);
    _c3prLOG5(`Handling ${event_type}.`);
    let event;
    try {
        event = await collectEventAndMarkAsProcessing_1.collectEventAndMarkAsProcessing({ event_type, c3prHubUrl, jwt }, _c3prLOG5);
        if (!event) {
            _c3prLOG5(`No ${event_type} collected (possibly due to concurrent attempts to collect the same event and this instance was late). Skipping.`, { meta: { event } });
            return;
        }
    }
    catch (error) {
        _c3prLOG5(`Couldn't collect ${event_type}. Skipping.`, { error });
        return;
    }
    _c3prLOG5 = _c3prLOG5({ euuid: event.uuid });
    let handlerFunctionResult;
    try {
        handlerFunctionResult = await handlerFunction(event, { ..._c3prLOG5 });
    }
    catch (error) {
        _c3prLOG5(`Error while executing handlerFunction() for event handling.`, { error, meta: { handlerFunction, event } });
        markAs_1.markAsUnprocessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt }, _c3prLOG5).catch(error => {
            _c3prLOG5(`Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { error, meta: { handlerFunction, event } });
        });
        return;
    }
    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleFirstCollectedEvent> Handler function should return an object of format {new_status, result?} (only new_status is mandatory).
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }
    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            await markAs_1.markAsProcessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt }, _c3prLOG5).catch(error => {
                _c3prLOG5(`Couldn't mark ${event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will ` +
                    `timeout and the event will be reprocessed, possibly generating duplicated effects.`, { error, meta: { handlerFunction, event } });
            });
            break;
        case 'UNPROCESSED':
            await markAs_1.markAsUnprocessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt }, _c3prLOG5).catch(error => {
                _c3prLOG5(`Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { error, meta: { handlerFunction, event } });
            });
            break;
        default:
            throw new Error(`<handleFirstCollectedEvent> Handler function returned a new_status of unsupported value. 
            handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }
    return handlerFunctionResult.result;
}
// noinspection JSUnusedGlobalSymbols
exports.default = handleFirstCollectedEvent;
//# sourceMappingURL=handleFirstCollectedEvent.js.map