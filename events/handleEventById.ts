import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import {collectEventByIdAndMarkAsProcessing} from "./collectEventAndMarkAsProcessing";
import {markAsProcessed, markAsUnprocessed} from "./markAs";

interface HandlerOutput {
    skipped: boolean;
    new_status: 'PROCESSED' | 'UNPROCESSED';
    result: any;
}

interface EventByIdHandler {
    event_type: string;
    event_uuid: string;
    handlerFunction: (event: any, log: any) => Promise<HandlerOutput> | HandlerOutput;
    c3prHubUrl: string;
    jwt: string;
}

async function handleResult(handlerFunctionResult: HandlerOutput, {event, handlerFunction, c3prHubUrl, jwt}) {

    if (handlerFunctionResult.skipped) {
        c3prLOG5(`handlerFunction() returned skipped===true. We'll do nothing, then.`, {meta: {handlerFunction, event}});
        return null;
    }

    if (!handlerFunctionResult || !handlerFunctionResult.new_status) {
        throw new Error(`<handleEventById> Handler function should return an object of format {new_status, result?} (only new_status is mandatory).
        handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }

    switch (handlerFunctionResult.new_status.toUpperCase()) {
        case 'PROCESSED':
            await markAsProcessed({event_type: event.event_type, uuid: event.uuid, c3prHubUrl, jwt}, c3prLOG5).catch(error => {
                c3prLOG5(
                    `Couldn't mark ${event.event_type}/${event.uuid} as PROCESSED. You must do it **MANUALLY**. If you don't, the PROCESSING status will `+
                    `timeout and the event will be reprocessed, possibly generating duplicated effects.`,
                    {error, meta: {handlerFunction, event}}
                );
            });
            break;
        case 'UNPROCESSED':
            await markAsUnprocessed({event_type: event.event_type, uuid: event.uuid, c3prHubUrl, jwt}, c3prLOG5).catch(error => {
                c3prLOG5(
                    `Couldn't mark ${event.event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`,
                    {error, meta: {handlerFunction, event}}
                );
            });
            break;
        default:
            throw new Error(`<handleEventById> Handler function returned a new_status of unsupported value. 
            handlerFunction was ${handlerFunction}. handlerFunction result received: ${JSON.stringify(handlerFunctionResult)}`);
    }

    return handlerFunctionResult.result;
}

// TODO document this can return null (not the result) when no event is collected OR when handlerFunction() returns skipped===true
async function handleEventById({event_type, event_uuid, handlerFunction, c3prHubUrl, jwt}: EventByIdHandler, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handleEventById', euuid: event_uuid});

    c3prLOG5(`Handling by id ${event_type}::${event_uuid}.`);

    let event = await collectEventByIdAndMarkAsProcessing({event_type, event_uuid, c3prHubUrl, jwt}, c3prLOG5);
    if (!event) {
        return;
    }
    c3prLOG5 = c3prLOG5({euuid: event.uuid});

    try {
        let handlerFunctionResult = await handlerFunction(event, c3prLOG5);
        return handleResult(handlerFunctionResult, {event, handlerFunction, c3prHubUrl, jwt});
    } catch (error) {
        c3prLOG5(`Error while executing handlerFunction() for event handling.`, {error, meta: {handlerFunction, event}});

        markAsUnprocessed({event_type, uuid: event.uuid, c3prHubUrl, jwt}, c3prLOG5).catch(error => {
            c3prLOG5(
                `Couldn't mark ${event_type}/${event.uuid} as UNPROCESSED. You must do it **MANUALLY**. If you don't, you'll have to wait until the PROCESSING status times out.`,
                {error, meta: {handlerFunction, event}}
            );
        });
        return;
    }

}

// noinspection JSUnusedGlobalSymbols
export default handleEventById;