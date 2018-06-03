"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
async function fetchEvent({ event_type, uuid }) {
    let { data: event } = await axios_1.default.get(__1.hubClientConfig.c3pr.hub.eventsUrl({ event_type, uuid }), { headers: __1.hubClientConfig.headers() });
    return event;
}
exports.fetchEvent = fetchEvent;
//# sourceMappingURL=fetchEvent.js.map