"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
function fetchFirstProjectForCloneUrl(clone_url_http) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = { Authorization: `Bearer ${__1.hubClientConfig.c3pr.hub.auth.jwt()}` };
        const { data } = yield axios_1.default.get(__1.hubClientConfig.c3pr.hub.projectsByCloneUrlHttp(clone_url_http), { headers });
        if (!data.length) {
            throw new Error('Project with URL ' + clone_url_http + ' not found.');
        }
        const [{ uuid: project_uuid }] = data;
        return project_uuid;
    });
}
exports.fetchFirstProjectForCloneUrl = fetchFirstProjectForCloneUrl;
//# sourceMappingURL=fetchFirstProjectForCloneUrl.js.map