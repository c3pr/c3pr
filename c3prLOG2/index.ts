const c3prLOG_original = require('../src/c3prLOG');

export const c3pr = {
    c3prLOG2({msg, logMetas, meta}) {
        c3prLOG_original(msg, meta || {}, ...(logMetas || []));
    }
};