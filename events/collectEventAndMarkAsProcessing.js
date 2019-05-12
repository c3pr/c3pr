"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
/**
 * When getting the return from this function, make sure you handle when it returns null, because it will be a common result.
 */
async function collectEventAndMarkAsProcessing({ event_type, c3prHubUrl, jwt }, c3prLOG5) {
    const headers = { Authorization: `Bearer ${jwt}` };
    /** @namespace event.payload */
    let { data: event, status } = await axios.get(`${c3prHubUrl}/api/v1/events/${event_type}/peek/unprocessed`, { headers });
    if (status !== 200) {
        return null;
    }
    try {
        await axios.patch(`${c3prHubUrl}/api/v1/events/${event_type}/${event.uuid}/meta/processing`, {}, { headers });
        return { uuid: event.uuid, event_type, payload: event.payload };
    }
    catch (error) {
        c3prLOG5(`Error while marking event ${event.uuid} of type ${event_type} as processing.`, { euuid: event.uuid, error });
        throw error;
    }
}
exports.collectEventAndMarkAsProcessing = collectEventAndMarkAsProcessing;
//# sourceMappingURL=collectEventAndMarkAsProcessing.js.map