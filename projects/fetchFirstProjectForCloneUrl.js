"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
async function fetchFirstProjectForCloneUrl(clone_url_http) {
    const { data } = await axios_1.default.get(__1.hubClientConfig.c3pr.hub.projectsByCloneUrlHttp(clone_url_http), { headers: __1.hubClientConfig.headers() });
    if (!data.length) {
        throw new Error('Project with URL ' + clone_url_http + ' not found.');
    }
    const [{ uuid: project_uuid }] = data;
    return project_uuid;
}
exports.fetchFirstProjectForCloneUrl = fetchFirstProjectForCloneUrl;
//# sourceMappingURL=fetchFirstProjectForCloneUrl.js.map