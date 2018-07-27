"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = require("uuid/v4");
const c3prLOG3_1 = require("../c3prLOG3");
function c3prLOG4(message, { lcid, euuid, logMetas, ids: outerIds, meta = {}, error, level = 0 }) {
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new Error(`c3prLOG4() called with different number or arguments. Wanted: 1 or 2. Passed: ${arguments.length} - ${JSON.stringify(arguments)}`);
    }
    const extraKeys = Object.keys(arguments[1] || {}).filter(key => !["lcid", "euuid", "logMetas", "level", "ids", "meta", "error"].includes(key));
    if (extraKeys.length) {
        throw new Error(`c3prLOG4() has too many keys. Additional keys passed: ${JSON.stringify(extraKeys)}. Full args: ${JSON.stringify(arguments)}`);
    }
    let ids = [...outerIds, lcid, euuid];
    meta.lcid = lcid;
    meta.euuid = euuid;
    c3prLOG3_1.default(message, { ids, meta, error, level });
}
c3prLOG4.logMetasToIds = c3prLOG3_1.logMetasToIds;
c3prLOG4.lcid = function () {
    return v4_1.default().split("-")[4];
};
exports.default = c3prLOG4;
//# sourceMappingURL=index.js.map