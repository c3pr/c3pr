const axios = require('axios').default;
const axiosRetry = require('axios-retry');

const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;

async function markAs({new_status, event_type, uuid, c3prHubUrl, jwt, retryWait = 2000}) {
    const client = axios.create({ baseURL: c3prHubUrl });
    axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

    const headers = {Authorization: `Bearer ${jwt}`};

    try {
        await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/${new_status.toLowerCase()}`, {}, {headers});
    } catch (error) {
        c3prLOG3(`Error while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`, {ids: [uuid], error});
        throw error;
    }
}

function markAsProcessed({event_type, uuid, c3prHubUrl, jwt, retryWait}) {
    return markAs({new_status: 'processed', event_type, uuid, c3prHubUrl, jwt, retryWait})
}

function markAsUnprocessed({event_type, uuid, c3prHubUrl, jwt, retryWait}) {
    return markAs({new_status: 'unprocessed', event_type, uuid, c3prHubUrl, jwt, retryWait})
}

module.exports = {
    markAs: {
        markAsProcessed,
        markAsUnprocessed
    }
};