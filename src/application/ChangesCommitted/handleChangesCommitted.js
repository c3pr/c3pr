const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prHubClient = require('node-c3pr-hub-client/events/markEventAsProcessing').c3prHubClient;

const c3prRTI = require('../requestToolInvocation/requestToolInvocation').c3pr;

const config = require('../../config');

const logMeta = {nodeName: 'c3pr-brain', moduleName: 'handleChangesCommitted'};

function handleChangesCommitted() {
    c3prLOG2({msg: `Handling ChangesCommitted.`, logMetas: [logMeta]});

    c3prHubClient.markEventAsProcessing(
        {eventType: `ChangesCommitted`, jwt: config.c3pr.jwt, logMetas: [logMeta]}
    ).catch(() => {
        c3prLOG2({msg: `Couldn't collect ChangesCommitted. Skipping.`, logMetas: [logMeta]});
    }).then((changesCommitted) => {
        c3prRTI.requestToolInvocation(changesCommitted);
    });
}

module.exports = {
    c3pr: {
        handleChangesCommitted
    }
};