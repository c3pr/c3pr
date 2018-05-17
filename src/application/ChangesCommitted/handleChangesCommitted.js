const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prCEAMAP = require('node-c3pr-hub-client/events/collectEventAndMarkAsProcessing').c3prCEAMAP;

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;

const config = require('../../config');

const logMeta = {nodeName: 'c3pr-brain', moduleName: 'handleChangesCommitted'};

function handleChangesCommitted() {
    c3prLOG2({msg: `Handling ChangesCommitted.`, logMetas: [logMeta]});

    c3prCEAMAP.collectEventAndMarkAsProcessing(
        {eventType: `ChangesCommitted`, c3prHubUrl: config.c3pr.hub.c3prHubUrl, jwt: config.c3pr.jwt, logMetas: [logMeta]}
    ).catch(() => {
        c3prLOG2({msg: `Couldn't collect ChangesCommitted. Skipping.`, logMetas: [logMeta]});
    }).then((changesCommitted) => {
        const parent = {
            event_type: `ChangesCommitted`,
            uuid: changesCommitted.uuid
        };
        // noinspection JSIgnoredPromiseFromCall
        /** @namespace changesCommitted.changed_files */
        c3prRTI.invokeTools({parent, repository: changesCommitted.repository, files: changesCommitted.changed_files});
    });
}

module.exports = {
    c3pr: {
        handleChangesCommitted
    }
};