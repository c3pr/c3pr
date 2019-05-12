"use strict";
const axios_1 = require("axios");
const axiosRetry = require('axios-retry');
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
async function markAs({ new_status, event_type, uuid, c3prHubUrl, jwt, lcid, sha, euuid, retryWait = 2000 }) {
    const client = axios_1.default.create({ baseURL: c3prHubUrl });
    axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
    const headers = { Authorization: `Bearer ${jwt}` };
    try {
        await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/${new_status.toLowerCase()}`, {}, { headers });
    }
    catch (error) {
        c3prLOG4(`Error while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`, { lcid, sha, euuid, error });
        throw error;
    }
}
function markAsProcessed({ event_type, uuid, c3prHubUrl, jwt, lcid, sha, euuid, retryWait }) {
    return markAs({ new_status: 'processed', event_type, uuid, c3prHubUrl, jwt, lcid, sha, euuid, retryWait });
}
function markAsUnprocessed({ event_type, uuid, c3prHubUrl, jwt, lcid, sha, euuid, retryWait }) {
    return markAs({ new_status: 'unprocessed', event_type, uuid, c3prHubUrl, jwt, lcid, sha, euuid, retryWait });
}
module.exports = {
    markAs: {
        markAsProcessed,
        markAsUnprocessed
    }
};
//# sourceMappingURL=markAs.js.map