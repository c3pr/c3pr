"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lib_1 = require("axios-retry/lib");
async function markAs({ new_status, event_type, uuid, c3prHubUrl, jwt, retryWait = 2000 }, c3prLOG5) {
    const client = axios_1.default.create({ baseURL: c3prHubUrl });
    lib_1.default(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
    const headers = { Authorization: `Bearer ${jwt}` };
    try {
        await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/${new_status.toLowerCase()}`, {}, { headers });
    }
    catch (error) {
        c3prLOG5(`Error while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`, { error });
        throw error;
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
//# sourceMappingURL=markAs.js.map