"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lib_1 = require("axios-retry/lib");
async function c3prHubRegisterNewEvent(args, c3prLOG5) {
    const { event_type, payload, c3prHubUrl, jwt, retryWait = 2000 } = args;
    try {
        c3prLOG5(`Registering new event of type '${event_type}'.`, { meta: { event_type, payload } });
        const client = axios_1.default.create({ baseURL: c3prHubUrl });
        // noinspection JSUnusedGlobalSymbols
        lib_1.default(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
        const headers = { Authorization: `Bearer ${jwt}` };
        await client.post(`/api/v1/events/${event_type}`, payload, { headers });
    }
    catch (error) {
        c3prLOG5(`Error while registering new event of type '${event_type}'.`, { error, meta: { payload } });
        throw error;
    }
}
exports.default = c3prHubRegisterNewEvent;
//# sourceMappingURL=registerNewEvent.js.map