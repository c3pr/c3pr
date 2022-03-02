"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
async function updatePrOfProject(project_uuid, pr_id, status, assignee) {
    let { data } = await axios_1.default.patch(__1.hubClientConfig.c3pr.hub.prOfProjectUrl(project_uuid, pr_id), { status, assignee }, { headers: __1.hubClientConfig.headers() });
    return data;
}
exports.updatePrOfProject = updatePrOfProject;
//# sourceMappingURL=updatePrOfProject.js.map