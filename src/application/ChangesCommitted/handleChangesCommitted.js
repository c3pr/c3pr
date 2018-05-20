const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prCEAMAP = require('node-c3pr-hub-client/events/collectEventAndMarkAsProcessing').c3prCEAMAP;

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;

const config = require('../../config');

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'handleChangesCommitted'}];

function handleChangesCommitted() {
    c3prLOG2({msg: `Handling ChangesCommitted.`, logMetas});

    c3prCEAMAP.collectEventAndMarkAsProcessing(
        {eventType: `ChangesCommitted`, c3prHubUrl: config.c3pr.hub.c3prHubUrl, jwt: config.c3pr.jwt, logMetas}
    ).catch((e) => {
        c3prLOG2({msg: `Couldn't collect ChangesCommitted. Skipping.`, logMetas, meta: {error: require('util').inspect(e)}});
    }).then((changesCommitted) => {
        if (!changesCommitted) {
            c3prLOG2({msg: `No ChangesCommitted collected (possibly due to concurrent attempts to collect the same event). Skipping.`, logMetas, meta: {changesCommitted}});
            return;
        }
        const parent = {
            event_type: `ChangesCommitted`,
            uuid: changesCommitted.uuid
        };
        /** @namespace changesCommitted.changed_files */
        c3prRTI.invokeTools({parent, repository: changesCommitted.repository, files: changesCommitted.changed_files})
            .catch(e => {
                c3prLOG2({
                    msg: `Error while invoking tools. Reason: '${e}'. Data: ${e.response && e.response.data}.`,
                    logMetas,
                    meta: {args: {parent, repository: changesCommitted.repository, files: changesCommitted.changed_files}, error: require('util').inspect(e)}
                });
            })
    });
}

module.exports = {
    c3pr: {
        handleChangesCommitted
    }
};