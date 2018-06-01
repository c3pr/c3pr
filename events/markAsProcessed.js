const axios = require('axios').default;
const axiosRetry = require('axios-retry');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const logMeta = {nodeName: 'node-c3pr-hub-client', moduleName: 'markAsProcessed'};

async function markAsProcessed({event_type, uuid, c3prHubUrl, jwt, logMetas: outerLogMetas, retryWait = 2000}) {
    const client = axios.create({ baseURL: c3prHubUrl });
    axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

    const headers = {Authorization: `Bearer ${jwt}`};

    try {
        await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/processed`, {}, {headers});
    } catch (error) {
        c3prLOG2({msg: `Error while marking event ${uuid} of type ${event_type} as PROCESSED.`, logMetas: [...(outerLogMetas || []), logMeta], error});
        throw error;
    }
}

module.exports = {
    markAsProcessed: {
        markAsProcessed
    }
};