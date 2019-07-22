"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lib_1 = require("axios-retry/lib");
async function markAs({ new_status, event_type, uuid, c3prHubUrl, jwt, retryWait = 2000 }, c3prLOG5) {
    const client = axios_1.default.create({ baseURL: c3prHubUrl });
    lib_1.default(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
    const headers = { Authorization: `Bearer ${jwt}` };
    let status;
    try {
        let response = await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/${new_status.toLowerCase()}`, {}, { headers });
        status = response.status;
    }
    catch (error) {
        c3prLOG5(`Error while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`, { error });
        throw error;
    }
    if (status === 401) {
        c3prLOG5(`Token deemed invalid while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`);
        throw new Error('Invalid JWT token');
    }
}
function markAsProcessed({ event_type, uuid, c3prHubUrl, jwt }, c3prLOG5) {
    return markAs({ new_status: 'processed', event_type, uuid, c3prHubUrl, jwt }, c3prLOG5);
}
exports.markAsProcessed = markAsProcessed;
function markAsUnprocessed({ event_type, uuid, c3prHubUrl, jwt }, c3prLOG5) {
    return markAs({ new_status: 'unprocessed', event_type, uuid, c3prHubUrl, jwt }, c3prLOG5);
}
exports.markAsUnprocessed = markAsUnprocessed;
function markAsProcessing({ event_type, uuid, c3prHubUrl, jwt }, c3prLOG5) {
    return markAs({ new_status: 'processing', event_type, uuid, c3prHubUrl, jwt }, c3prLOG5);
}
exports.markAsProcessing = markAsProcessing;
//# sourceMappingURL=markAs.js.map