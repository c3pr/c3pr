const axios = require('axios');
const axiosRetry = require('axios-retry');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'markAsProcessed'};

async function markAsProcessed({event_type, uuid, c3prHubUrl, jwt, logMetas: outerLogMetas, retryWait = 2000}) {

    const client = axios.create({ baseURL: c3prHubUrl });
    // noinspection JSUnusedGlobalSymbols
    axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

    const headers = {Authorization: `Bearer ${jwt}`};

    try {
        await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/processed`, {}, {headers});
    } catch (e) {
        c3prLOG2({
            msg: `Error while marking event ${uuid} of type ${event_type} as PROCESSED. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}`,
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