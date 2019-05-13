"use strict";
const axios_1 = require("axios");
const lib_1 = require("axios-retry/lib");
const c3prLOG5_1 = require("node-c3pr-logger/c3prLOG5");
function generateLogFunction(__c3prLOG5, outerLCID, outerSHA, outerEUUID) {
    if (__c3prLOG5) {
        return __c3prLOG5;
    }
    return c3prLOG5_1.default({ lcid: outerLCID, sha: outerSHA || '!register-new-event', ...(outerEUUID && { euuid: outerEUUID }) });
}
async function registerNewEvent(args, __c3prLOG5) {
    const { event_type, payload, c3prHubUrl, jwt, lcid, sha, euuid, retryWait = 2000 } = args;
    let _c3prLOG5 = generateLogFunction(__c3prLOG5, lcid, sha, euuid);
    try {
        _c3prLOG5(`Registering new event of type '${event_type}'.`, { meta: { event_type, payload } });
        const client = axios_1.default.create({ baseURL: c3prHubUrl });
        // noinspection JSUnusedGlobalSymbols
        lib_1.default(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });
        const headers = { Authorization: `Bearer ${jwt}` };
        await client.post(`/api/v1/events/${event_type}`, payload, { headers });
    }
    catch (error) {
        _c3prLOG5(`Error while registering new event of type '${event_type}'.`, { error, meta: { payload } });
        throw error;
    }
}
module.exports = {
    c3prRNE: {
        registerNewEvent
    }
};
//# sourceMappingURL=registerNewEvent.js.map