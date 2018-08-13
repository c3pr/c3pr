"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG4_1 = require("node-c3pr-logger/c3prLOG4");
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;
const markAsProcessed = require('./markAs').markAs.markAsProcessed;
const markAsUnprocessed = require('./markAs').markAs.markAsUnprocessed;
// TODO document this can return null (not the result) when no event is collected
async function handleFirstCollectedEvent({ event_type, handlerFunction, c3prHubUrl, jwt, lcid: outerLCID, sha: outerSHA, euuid: outerEUUID }) {
    let lcid = outerLCID || c3prLOG4_1.default.lcid();
    let sha = outerSHA || 'unknown';
    let euuid = outerEUUID || 'pre-event';
    c3prLOG4_1.default(`Handling ${event_type}.`, { lcid, sha, euuid });
    let event;
    try {
        event = await collectEventAndMarkAsProcessing({ event_type, c3prHubUrl, jwt, lcid, sha, euuid });
        if (!event) {
            c3prLOG4_1.default(`No ${event_type} collected (possibly due to concurrent attempts to collect the same event and this instance was late). Skipping.`, { lcid, sha, euuid, meta: { event } });
            return;
        }
    }
    catch (error) {
        c3prLOG4_1.default(`Couldn't collect ${event_type}. Skipping.`, { lcid, sha, euuid, error });
        return;
    }
    euuid = event.uuid;
    let handlerFunctionResult;
    try {
        handlerFunctionResult = await handlerFunction(event, { lcid, sha, euuid });
    }
    catch (error) {
        c3prLOG4_1.default(`Error while executing handlerFunction() for event handling.`, { lcid, sha, euuid, error, meta: { handlerFunction, event } });
        markAsUnprocessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt, lcid, sha, euuid }).catch(error => {
            c3prLOG4_1.default(`Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { lcid, sha, euuid, error, meta: { handlerFunction, event } });
        });
        return;
    }
    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleFirstCollectedEvent> Handler function should return an object of format {new_status, result}, being new_status mandatory.
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }
    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            await markAsProcessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt, lcid, sha, euuid }).catch(error => {
                c3prLOG4_1.default(`Couldn't mark ${event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will ` +
                    `timeout and the event will be reprocessed, possibly generating duplicated effects.`, { lcid, sha, euuid, error, meta: { handlerFunction, event } });
            });
            break;
        case 'UNPROCESSED':
            await markAsUnprocessed({ event_type, uuid: event.uuid, c3prHubUrl, jwt, lcid, sha, euuid }).catch(error => {
                c3prLOG4_1.default(`Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`, { lcid, sha, euuid, error, meta: { handlerFunction, event } });
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