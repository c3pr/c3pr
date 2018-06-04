import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import { c3prRNE } from 'node-c3pr-hub-client/events/registerNewEvent';


import config from '../../config';


function emitChangesCommitted(changesCommitted) {
    const logMeta = {nodeName: 'c3pr-repo-gitlab', correlationId: changesCommitted.repository.revision, moduleName: 'emitChangesCommitted'};
    const logMetas = [logMeta];

    c3prLOG2({
        msg: `Registering new event of type 'ChangesCommitted' for repository ${changesCommitted.repository.clone_url_http} and rev ${changesCommitted.repository.revision}.`,
        logMetas,
        meta: {payload: changesCommitted}
    });

    return c3prRNE.registerNewEvent({
        event_type: `ChangesCommitted`,
        payload: changesCommitted,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        logMetas
    })
        .catch(error => {
            c3prLOG2({msg: `Error while registering new event: ChangesCommitted.`, logMetas, error});
        })
}

export { emitChangesCommitted };
