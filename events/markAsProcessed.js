const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'markAsProcessed'};

async function markAsProcessed({event_type, uuid, c3prHubUrl, jwt, logMetas: outerLogMetas}) {
    const headers = {Authorization: `Bearer ${jwt}`};

    try {
        await axios.patch(`${c3prHubUrl}/api/v1/events/${event_type}/${uuid}/meta/processed`, {}, {headers});
    } catch (e) {
        c3prLOG2({
            msg: `Error while marking event ${uuid} of type ${event_type} as PROCESSED. Reason: '${e}'. Data: ${e.response && e.response.data}`,
            logMetas: [...(outerLogMetas || []), logMeta],
            meta: {error: require('util').inspect(e)}
        });
        throw e;
    }
}

module.exports = {
    markAsProcessed: {
        markAsProcessed
    }
};