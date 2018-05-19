"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG_original = require('../src/c3prLOG');
exports.c3pr = {
    c3prLOG2({ msg, logMetas, meta }) {
        if (arguments.length !== 1) {
            throw new Error(`c3prLOG2() called with different number or arguments. Wanted: 1. Passed: ${arguments.length} - ${JSON.stringify(arguments)}`);
        }
        c3prLOG_original(msg, meta || {}, ...(logMetas || []));
    }
};
//# sourceMappingURL=index.js.map