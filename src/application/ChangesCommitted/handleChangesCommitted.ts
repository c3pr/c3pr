import config from '../../config';
import invokeTools from "../invokeTool/invokeTools";
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";


function handleChangesCommitted(c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handleChangesCommitted'});
    return handleFirstCollectedEvent({
            event_type: `ChangesCommitted`,
            handlerFunction: changesCommittedHandler,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        c3prLOG5
    );
}

async function changesCommittedHandler(changesCommittedEvent, {lcid, sha, euuid}): Promise<any> {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid, caller_name: 'changesCommittedHandler'});
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
            _c3prLOG5
        );
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        _c3prLOG5(`Error while invoking tools.`, {error, meta: {changesCommittedEvent}});
        throw error;
    }
}

export default handleChangesCommitted;