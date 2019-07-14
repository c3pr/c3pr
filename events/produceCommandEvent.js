"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lib_1 = require("axios-retry/lib");
const v4_1 = require("uuid/v4");
async function produceCommandEvent(event, config, c3prLOG5) {
    const event_type = event.event_type;
    const { c3prHubUrl, jwt, retryWait = 2000 } = config;
    // we dont use spread because we care about the order and not adding extra props
    const payload = {
        event_type,
        project_clone_http_url: event.project_clone_http_url,
        commit_hash: event.commit_hash,
        uuid: uuid(),
        timestamp: timestamp(),
        command: event.command,
        args: event.args,
        meta: event.meta
    };
    try {
        c3prLOG5(`Registering new event for type '${event_type}'.`, { meta: { payload } });
        const client = axios_1.default.create({ baseURL: c3prHubUrl });
        lib_1.default(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
        const headers = { Authorization: `Bearer ${jwt}` };
        await client.post(`/api/v1/events/${event_type}`, payload, { headers });
    }
    catch (error) {
        c3prLOG5(`Error while registering new event of type '${event_type}'.`, { error, meta: { payload } });
        throw error;
    }
}
exports.default = produceCommandEvent;
function timestamp() {
    return new Date().toISOString();
}
function uuid() {
    return v4_1.default();
}
//# sourceMappingURL=produceCommandEvent.js.map