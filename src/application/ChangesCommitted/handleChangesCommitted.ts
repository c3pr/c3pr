import config from '../../config';
import invokeTools from "../invokeTool/invokeTools";
import handleEventById from 'node-c3pr-hub-client/events/handleEventById';


function handleChangesCommitted(request, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handleChangesCommitted'});

    return handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction: changesCommittedHandler as any,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}

async function changesCommittedHandler(changesCommittedEvent, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'changesCommittedHandler'});

    const parentEvent = {
        event_type: changesCommittedEvent.event_type,
        uuid: changesCommittedEvent.uuid
    };
    try {
        let result = await invokeTools({
                parentEvent,
                changesCommittedRootEuuid: changesCommittedEvent.uuid,
                repository: changesCommittedEvent.payload.repository
            },
            changesCommittedEvent.payload.changed_files,
            c3prLOG5
        );
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        c3prLOG5(`Error while invoking tools.`, {error, meta: {changesCommittedEvent}});
        throw error;
    }
}

export default handleChangesCommitted;