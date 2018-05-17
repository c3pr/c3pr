const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const config = require('../../config');


function emitChangesCommitted(changesCommitted, outerLogMetas) {
    const logMeta = {nodeName: 'c3pr-brain', correlationId: changesCommitted.repository.revision, moduleName: 'emitChangesCommitted'};
    const logMetas = [...(outerLogMetas || []), logMeta];

    c3prLOG2({
        msg: `Registering new event of type 'ChangesCommitted' for repository ${changesCommitted.repository.clone_url_http} and rev ${changesCommitted.repository.revision}.`,
        logMetas,
        meta: {payload: changesCommitted}
    });

    return c3prRNE.registerNewEvent({
        eventType: `ChangesCommitted`,
        payload: changesCommitted,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.jwt,
        logMetas
    })
        .catch(e => {
            c3prLOG2({
                msg: `Error while registering new event: ChangesCommitted. Reason: '${e}'. Data: ${e.response && e.response.data}.`,
                logMetas,
                meta: {error: require('util').inspect(e)}
            });
        })
}

module.exports = emitChangesCommitted;