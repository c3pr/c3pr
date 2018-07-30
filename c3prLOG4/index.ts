import { v4 as uuidv4 } from 'uuid';
import c3prLOG3, { logMetasToIds } from "../c3prLOG3";
const c3prLOG_original = require('../src/c3prLOG');

function c3prLOG4(message: string, {lcid, euuid, meta = {}, error, level = 0}: {lcid: string, euuid: string, meta?: any; error?: Error; level?: number}) {
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
    c3prLOG3(message, {ids, meta, error, level});
}

(c3prLOG4 as IC3prLOG4).logMetasToIds = logMetasToIds;
(c3prLOG4 as IC3prLOG4).lcid = function () {
    return uuidv4().split("-")[4];
};

(c3prLOG4 as IC3prLOG4).testMode = c3prLOG_original.testMode;
(c3prLOG4 as IC3prLOG4).isEnvVarSet = c3prLOG_original.isEnvVarSet;

interface IC3prLOG4 {
    (message: string,
     {lcid, euuid, logMetas, ids, meta, error, level}: {lcid: string, euuid: string, logMetas?: any, ids?: (string|number)[]; meta?: any; error?: Error; level?: number}): void;
    logMetasToIds(lms: any[]): (string|number)[];
    lcid(): string;
    testMode(): void;
    isEnvVarSet(): boolean;
}

// noinspection JSUnusedGlobalSymbols
export default c3prLOG4 as IC3prLOG4;