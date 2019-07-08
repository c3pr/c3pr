"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
async function patchAsProcessing(c3prHubUrl, event_type, event, headers, c3prLOG5) {
    try {
        await axios.patch(`${c3prHubUrl}/api/v1/events/${event_type}/${event.uuid}/meta/processing`, {}, { headers });
    }
    catch (error) {
        c3prLOG5(`Error while marking event ${event.uuid} of type ${event_type} as processing.`, {
            euuid: event.uuid,
            error
        });
        throw error;
    }
}
async function collectEventAndMarkAsProcessing({ event_type, c3prHubUrl, jwt }, c3prLOG5) {
    const headers = { Authorization: `Bearer ${jwt}` };
    /** @namespace event.payload */
    let { data: event, status } = await axios.get(`${c3prHubUrl}/api/v1/events/${event_type}/peek/unprocessed`, { headers });
    if (status !== 200) {
        // no event is found, somebody took it first
        return null;
    }
    await patchAsProcessing(c3prHubUrl, event_type, event, headers, c3prLOG5);
    return { uuid: event.uuid, event_type, payload: event.payload };
}
exports.collectEventAndMarkAsProcessing = collectEventAndMarkAsProcessing;
async function collectEventByIdAndMarkAsProcessing({ event_type, event_uuid, c3prHubUrl, jwt }, c3prLOG5) {
    c3prLOG5 = c3prLOG5({ caller_name: 'collectEventByIdAndMarkAsProcessing' });
    try {
        const headers = { Authorization: `Bearer ${jwt}` };
        /** @namespace event.payload */
        let { data: event, status } = await axios.get(`${c3prHubUrl}/api/v1/events/${event_type}/${event_uuid}`, { headers });
        if (status !== 200) {
            // some crazy error?
            c3prLOG5(`Event ${event_type}/${event_uuid} errored. Skipping for now.`, { meta: { event_type, event_uuid, event } });
            return null;
        }
        if (event.meta.status !== 'UNPROCESSED') {
            c3prLOG5(`Event ${event_type}/${event_uuid} is not UNPROCESSED. Skipping for now.`, { meta: { event_type, event_uuid, event } });
            return null;
        }
        await patchAsProcessing(c3prHubUrl, event_type, event, headers, c3prLOG5);
        return { uuid: event.uuid, event_type, payload: event.payload };
    }
    catch (error) {
        c3prLOG5(`Error while collecting ${event_type}/${event_uuid}`, { error, meta: { event_type, event_uuid } });
    }
}
exports.collectEventByIdAndMarkAsProcessing = collectEventByIdAndMarkAsProcessing;
//# sourceMappingURL=collectEventAndMarkAsProcessing.js.map