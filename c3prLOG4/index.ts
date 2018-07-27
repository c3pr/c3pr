import uuidv4 from 'uuid/v4';
import c3prLOG3, { logMetasToIds } from "../c3prLOG3";

function c3prLOG4(message: string, {lcid, euuid, logMetas, ids: outerIds, meta = {}, error, level = 0}: {lcid: string, euuid: string, logMetas?: any, ids?: (string|number)[]; meta?: any; error?: Error; level?: number}) {
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
    c3prLOG3(message, {ids, meta, error, level});
}

(c3prLOG4 as IC3prLOG4).logMetasToIds = logMetasToIds;
(c3prLOG4 as IC3prLOG4).lcid = function () {
    return uuidv4().split("-")[4];
};

interface IC3prLOG4 {
    (message: string,
     {lcid, euuid, logMetas, ids, meta, error, level}: {lcid: string, euuid: string, logMetas?: any, ids?: (string|number)[]; meta?: any; error?: Error; level?: number}): Promise<any>;
    logMetasToIds(lms: any[]): (string|number)[];
    lcid(): string;
}

export default c3prLOG4 as IC3prLOG4;