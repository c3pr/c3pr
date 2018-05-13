"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c3prLOG_original = require('../src/c3prLOG');
exports.c3pr = {
    c3prLOG2({ msg, logMetas, meta }) {
        c3prLOG_original(msg, meta || {}, ...logMetas);
    }
};
//# sourceMappingURL=index.js.map