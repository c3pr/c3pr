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
    let { augmentedMsg, augmentedMeta } = augmentWithError(message, stack, options);
    return printAndInsertIntoDatabase({
        message: augmentedMsg,
        lcid: options.lcid,
        euuid: options.euuid,
        service_name,
        caller_name,
        meta: augmentedMeta,
        error: options.error
    });
}
// noinspection JSUnusedGlobalSymbols
exports.default = c3prLOG4;
function augmentWithError(message, stack, options) {
    let augmentedMsg = message || '';
    let augmentedMeta = Object.assign({ stack }, (options.meta || {}));
    if (options.error) {
        const error = options.error;
        augmentedMsg = augmentedMsg.trim() + ` - Error reason: '${error}'. Data: ${error.response && JSON.stringify(error.response.data) || '<no data>'}.`;
        augmentedMeta.error = util.inspect(error);
    }
    return { augmentedMsg, augmentedMeta };
}
c3prLOG4.lcid = function () {
    // noinspection TypeScriptValidateJSTypes
    return uuid_1.v4().split("-")[4];
};
let testModeActivated = false;
c3prLOG4.testMode = () => testModeActivated = true;
c3prLOG4.isEnvVarSet = () => !!config && !!config.c3pr && !!config.c3pr.logger.mongoUrl;
async function printAndInsertIntoDatabase(options) {
    showWarningIfDatabaseNotDefined();
    console.log(`[${options.lcid}] [${options.euuid}] <${options.caller_name}>`, options.message);
    if (!config.c3pr.logger.mongoUrl) {
        return;
    }
    try {
        // @ts-ignore
        const client = await mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, { useNewUrlParser: true });
        let logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + '4' + (testModeActivated ? "-test" : ""));
        await logs.insertOne({
            dateTime: new Date().toISOString(),
            node: options.service_name,
            service_name: options.service_name,
            moduleName: options.caller_name,
            caller_name: options.caller_name,
            lcid: options.lcid,
            euuid: options.euuid,
            metadata: options.meta,
            message: options.message
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