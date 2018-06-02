const util = require('util');
const c3prLOG_original = require('../src/c3prLOG');

export interface Log {
    msg: string;
    logMetas?: any[];
    meta?: any;
    error?: any;
}

export const c3pr = {
    c3prLOG2({msg, logMetas, meta, error: e}: Log) {
        if (arguments.length !== 1) {
            throw new Error(`c3prLOG2() called with different number or arguments. Wanted: 1. Passed: ${arguments.length} - ${JSON.stringify(arguments)}`);
        }
        const extraKeys = Object.keys(arguments[0]).filter(key => !["msg", "logMetas", "meta", "error"].includes(key));
        if (extraKeys.length) {
            throw new Error(`c3prLOG2() argument must be of format {msg, logMetas, meta}. Additional keys passed: ${JSON.stringify(extraKeys)}. Full arg: ${JSON.stringify(arguments[0])}`);
        }
        let msgMsg = msg || '';
        let metaMeta = meta || {};
        if (e) {
            msgMsg += `Error reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}.`;
            metaMeta.error = util.inspect(e);
        }
        c3prLOG_original(msgMsg, metaMeta, ...(logMetas || []));
    }
};

export const c3prLOG2 = c3pr.c3prLOG2;