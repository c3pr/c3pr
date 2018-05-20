const mongodb = require('mongodb');
const config = require('./config');
function wrap(arr, prefix = `[`, suffix = `]`) {
    return arr.map(i => `${prefix}${i}${suffix}`).join(' ');
}
let warningShown = false;
function showWarningIfDatabaseNotDefined() {
    if (!config.c3pr.logger.mongoUrl && !warningShown) {
        console.log('Logs: C3PR_MONGO_URL env var is not defined. Printing to STDOUT only. (This message will be printed only once every 5 minutes.)');
        warningShown = true;
        setTimeout(() => warningShown = false, 5 * 60 * 1000).unref();
    }
}
const emptyLogMeta = [{ nodeName: "empty-logMeta-nodeName", correlationIds: ["empty-logMeta-correlationIds"], moduleNames: ["empty-logMeta-moduleNames"] }];
const emptyNodeName = { nodeName: "empty-nodeName" };
async function logWithMeta(message, metadata, logMetasArg) {
    let logMetas = logMetasArg.filter(log => log);
    if (!logMetas.length) {
        console.log("WARNING: Called c3prLOG with no LogMeta.");
        logMetas = emptyLogMeta;
    }
    const nodeName = (logMetas.find(logMeta => !!logMeta.nodeName) || emptyNodeName).nodeName;
    const correlationIds = logMetas.reduce((acc, { correlationId, correlationIds }) => acc.concat(correlationId || []).concat(correlationIds || []), []);
    const moduleNames = logMetas.reduce((acc, { moduleName, moduleNames }) => acc.concat(moduleName || []).concat(moduleNames || []), []);
    await log(nodeName, correlationIds, moduleNames, message, metadata);
}
async function log(nodeName, correlationIds, moduleNames, message, metadata) {
    showWarningIfDatabaseNotDefined();
    console.log(wrap(correlationIds), wrap(moduleNames, '<', '>'), message);
    if (!config.c3pr.logger.mongoUrl) {
        return;
    }
    const client = await mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl);
    let logs = client.db(config.c3pr.logger.database).collection(config.c3pr.logger.collection + (c3prLOG.testModeActivated ? "-test" : ""));
    await logs.insertOne({ node: nodeName, dateTime: new Date().toISOString(), correlationIds, moduleNames, message, metadata });
    await client.close();
}
function isLogMeta(o) {
    return o && (!!o.correlationId || !!o.correlationIds) && (!!o.moduleName || !!o.moduleNames);
}
const c3prLOG = async function (message, ...metas) {
    if (!isLogMeta(metas[0])) {
        let metadata = metas.shift();
        return logWithMeta(message, metadata, metas);
    }
    else {
        return logWithMeta(message, {}, metas);
    }
};
c3prLOG.testMode = () => c3prLOG.testModeActivated = true;
c3prLOG.isEnvVarSet = () => !!config && !!config.c3pr && !!config.c3pr.logger.mongoUrl;
module.exports = c3prLOG;
//# sourceMappingURL=c3prLOG.js.map