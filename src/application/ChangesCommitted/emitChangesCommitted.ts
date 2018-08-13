import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import { c3prRNE } from 'node-c3pr-hub-client/events/registerNewEvent';

import config from '../../config';

function emitChangesCommitted(changesCommitted, {lcid, sha, euuid}) {

    c3prLOG4(
        `Registering new event of type 'ChangesCommitted' for repository ${changesCommitted.repository.clone_url_http} and rev ${changesCommitted.repository.revision}.`,
        {lcid, sha, euuid, meta: {payload: changesCommitted}}
    );

    return c3prRNE.registerNewEvent({
        event_type: `ChangesCommitted`,
        payload: changesCommitted,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        lcid, sha, euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: ChangesCommitted.`, {lcid, sha, euuid, error});
    });
}

export { emitChangesCommitted };
