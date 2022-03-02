import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';

import config from '../../config';

function emitChangesCommitted(changesCommitted, c3prLOG5) {
    c3prLOG5(
        `Registering new event of type 'ChangesCommitted' for repository ${changesCommitted.repository.clone_url_http} and rev ${changesCommitted.repository.revision}.`,
        {meta: {payload: changesCommitted}}
    );

    return c3prHubRegisterNewEvent(
        {
            event_type: `ChangesCommitted`,
            payload: changesCommitted,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.hub.auth.jwt
        },
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: ChangesCommitted.`, {error});
    });
}

export {emitChangesCommitted};
