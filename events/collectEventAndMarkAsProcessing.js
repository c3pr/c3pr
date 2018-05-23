const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'collectEventAndMarkAsProcessing'};

/**
 * When getting the return from this function, make sure you handle when it returns null, because it will be a common result.
 */
async function collectEventAndMarkAsProcessing({event_type, c3prHubUrl, jwt, logMetas: outerLogMetas}) {
    const headers = {Authorization: `Bearer ${jwt}`};

    /** @namespace event.payload */
    let {data: event, status} = await axios.get(`${c3prHubUrl}/api/v1/events/${event_type}/peek/unprocessed`, {headers});
    if (status !== 200) {
        return null;
    }

    try {
        await axios.patch(`${c3prHubUrl}/api/v1/events/${event_type}/${event.uuid}/meta/processing`, {}, {headers});
        return {uuid: event.uuid, event_type, payload: event.payload};
    } catch (e) {
        c3prLOG2({
            msg: `Error while marking event ${event.uuid} of type ${event_type} as processing. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}`,
            logMetas: [...(outerLogMetas || []), logMeta],
            meta: {error: require('util').inspect(e)}
        });
        throw e;
    }
}

module.exports = {
    collectEventAndMarkAsProcessing: {
        collectEventAndMarkAsProcessing
    }
};