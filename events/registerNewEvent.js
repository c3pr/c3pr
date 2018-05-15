const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'registerNewEvent'};

async function registerNewEvent({eventType, payload, c3prHubUrl, jwt, logMetas: outerLogMetas}) {
    try {
        const headers = {Authorization: `Bearer ${jwt}`};
        await axios.post(`${c3prHubUrl}/api/v1/events/${eventType}`, payload, {headers});
    } catch (e) {
        c3prLOG2({
            msg: `Error while registering new event of type ${eventType}. Reason: '${e}'. Data: ${e.response && e.response.data}`,
            logMetas: [...(outerLogMetas || []), logMeta],
            meta: {payload, error: require('util').inspect(e)}
        });
        throw e;
    }
}

module.exports = {
    c3prRNE: {
        registerNewEvent
    }
};