Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const config = require("../src/config");
const mongodb = require("mongodb");
const util = require("util");
const functionScriptFileDetector_1 = require("./functionScriptFileDetector");
function c3prLOG4(message, options) {
    if (typeof message !== 'string') {
        throw new Error(`c3prLOG4()'s first argument should be a string! Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (arguments.length !== 2) {
        throw new Error(`c3prLOG4() called with different number or arguments. Needed: 2. Received(${arguments.length}): ${JSON.stringify(arguments)}`);
    }
    if (!options.lcid || !options.euuid) {
        throw new Error(`c3prLOG4(): lcid and euuid are mandatory. Full args: ${JSON.stringify(arguments)}`);
    }
    const extraKeys = Object.keys(arguments[1] || {}).filter(key => !["lcid", "euuid", "level", "meta", "error"].includes(key));
    if (extraKeys.length) {
        throw new Error(`c3prLOG4() has too many keys. Additional keys passed: ${JSON.stringify(extraKeys)}. Full args: ${JSON.stringify(arguments)}`);
    }
    const { stack, service_name, caller_name } = functionScriptFileDetector_1.default((options.level || 0) + 1);
    return printAndInsertIntoDatabase({
        message: augmentWithError(message, options),
        lcid: options.lcid,
        euuid: options.euuid,
        service_name,
        caller_name,
        meta: Object.assign({ stack }, (options.meta || {})),
        error: options.error
    });
}
// noinspection JSUnusedGlobalSymbols
exports.default = c3prLOG4;
function augmentWithError(message, options) {
    if (options.error) {
        const e = options.error;
        return (message || '').trim() + ` - Error reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || '<no data>'}.`;
    }
    return message || '';
}
c3prLOG4.lcid = function () {
    // noinspection TypeScriptValidateJSTypes
    return uuid_1.v4().split("-")[4];
};
let testModeActivated = false;
c3prLOG4.testMode = () => testModeActivated = true;
c3prLOG4.isEnvVarSet = () => !!config && !!config.c3pr && !!config.c3pr.logger.mongoUrl;
function printShort(euuid) {
    const split = euuid.split('-');
    if (split.length === 5) {
        return split[0];
    }
    return euuid;
}
async function printAndInsertIntoDatabase(options) {
    showWarningIfDatabaseNotDefined();
    console.log(`[${options.lcid}] [${printShort(options.euuid)}] <${options.caller_name}>`, options.message);
    if (!config.c3pr.logger.mongoUrl) {
        return;
    }
    try {
        // @ts-ignore
        const client = await mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, { useNewUrlParser: true });
        let logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + '4' + (testModeActivated ? "-test" : ""));
        await logs.insertOne({
            date_time: new Date().toISOString(),
            service_name: options.service_name,
            caller_name: options.caller_name,
            lcid: options.lcid,
            euuid: options.euuid,
            metadata: options.meta,
            message: options.message,
            error: util.inspect(options.error)
        });
        await client.close();
    }
    catch (e) {
        showWarning(`Error while attempting to connect/save log message: ${e}`);
    }
}
let _warningShown = {};
function showWarning(warningMsg) {
    if (!_warningShown[warningMsg]) {
        console.log(`*** [note-c3pr-logger] ${warningMsg} (This message will be printed only once every 5 minutes.)`);
        _warningShown[warningMsg] = true;
        setTimeout(() => {
            _warningShown[warningMsg] = false;
        }, 5 * 60 * 1000).unref();
    }
}
function showWarningIfDatabaseNotDefined() {
    if (!config.c3pr.logger.mongoUrl) {
        showWarning('Logs: C3PR_MONGO_URL env var is not defined. Printing to STDOUT only.');
    }
}
//# sourceMappingURL=index.js.map