"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const c3prLOG3_1 = require("../c3prLOG3");
const c3prLOG_original = require('../src/c3prLOG');
function c3prLOG4(message, { lcid, euuid, meta = {}, error, level = 0 }) {
    if (typeof message !== 'string') {
        throw new Error(`c3prLOG4()'s first argument should be a string! Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (arguments.length !== 2) {
        throw new Error(`c3prLOG4() called with different number or arguments. Needed: 2. Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (!lcid || !euuid) {
        throw new Error(`c3prLOG4(): lcid and euuid are mandatory. Full args: ${JSON.stringify(arguments)}`);
    }
    const extraKeys = Object.keys(arguments[1] || {}).filter(key => !["lcid", "euuid", "level", "meta", "error"].includes(key));
    if (extraKeys.length) {
        throw new Error(`c3prLOG4() has too many keys. Additional keys passed: ${JSON.stringify(extraKeys)}. Full args: ${JSON.stringify(arguments)}`);
    }
    let ids = [lcid, euuid];
    meta.lcid = lcid;
    meta.euuid = euuid;
    c3prLOG3_1.default(message, { ids, meta, error, level });
}
c3prLOG4.logMetasToIds = c3prLOG3_1.logMetasToIds;
c3prLOG4.lcid = function () {
    return uuid_1.v4().split("-")[4];
};
c3prLOG4.testMode = c3prLOG_original.testMode;
c3prLOG4.isEnvVarSet = c3prLOG_original.isEnvVarSet;
// noinspection JSUnusedGlobalSymbols
exports.default = c3prLOG4;
//# sourceMappingURL=index.js.map