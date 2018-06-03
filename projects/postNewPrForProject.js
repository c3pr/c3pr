"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
async function postNewPrForProject(project_uuid, pr) {
    let { data } = await axios_1.default.post(__1.hubClientConfig.c3pr.hub.prsForProjectUrl(project_uuid), pr, { headers: __1.hubClientConfig.headers() });
    return data;
}
exports.postNewPrForProject = postNewPrForProject;
//# sourceMappingURL=postNewPrForProject.js.map