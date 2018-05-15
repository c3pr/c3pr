const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const c3prRTI = require('../requestToolInvocation/requestToolInvocation').c3pr;

const config = require('../../config');

const logMeta = {nodeName: 'c3pr-brain', moduleName: 'handleChangesCommitted'};

async function markEventAsProcessing(eventType, jwt, logMetas) {
    const headers = {Authorization: `Bearer ${jwt}`};

    /** @namespace event.payload */
    let {data: event} = await axios.get(`/api/v1/events/${eventType}/peek/unprocessed`, {headers});

    try {
        await axios.patch(`/api/v1/events/${eventType}/${event.uuid}/meta/processing`, {}, {headers});
        return event.payload;
    } catch (e) {
        c3prLOG2({msg: `Error while marking event ${event.uuid} of type ${eventType} as processing.`, logMetas, meta: e});
        throw e;
    }
}

function handleChangesCommitted() {
    c3prLOG2({msg: `Handling ChangesCommitted.`, logMetas: [logMeta]});

    markEventAsProcessing(`ChangesCommitted`, config.c3pr.jwt, [logMeta]).catch(() => {
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