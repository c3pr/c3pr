const axios = require('axios');
const axiosRetry = require('axios-retry');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'registerNewEvent'};

async function registerNewEvent({event_type, payload, c3prHubUrl, jwt, logMetas: outerLogMetas, retryWait = 2000}) {
    const logMetas = [...(outerLogMetas || []), logMeta];
    try {

        c3prLOG2({
            msg: `Registering new event of type '${event_type}'.`,
            logMetas,
            meta: {event_type, payload}
        });
        const client = axios.create({ baseURL: c3prHubUrl });

        // noinspection JSUnusedGlobalSymbols
        axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

        const headers = {Authorization: `Bearer ${jwt}`};
        await client.post(`/api/v1/events/${event_type}`, payload, {headers});
    } catch (e) {
        c3prLOG2({
            msg: `Error while registering new event of type '${event_type}'. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}.`,
            logMetas,
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