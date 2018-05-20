"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG_original = require('../src/c3prLOG');
exports.c3pr = {
    c3prLOG2({ msg, logMetas, meta }) {
        if (arguments.length !== 1) {
            throw new Error(`c3prLOG2() called with different number or arguments. Wanted: 1. Passed: ${arguments.length} - ${JSON.stringify(arguments)}`);
        }
        const extraKeys = Object.keys(arguments[0]).filter(key => !["msg", "logMetas", "meta"].includes(key));
        if (extraKeys.length) {
            throw new Error(`c3prLOG2() argument must be of format {msg, logMetas, meta}. Additional keys passed: ${JSON.stringify(extraKeys)}. Full arg: ${JSON.stringify(arguments[0])}`);
        }
        c3prLOG_original(msg, meta || {}, ...(logMetas || []));
    }
};
exports.c3prLOG2 = exports.c3pr.c3prLOG2;
//# sourceMappingURL=index.js.map