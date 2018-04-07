const mongodb = require('mongodb');
const config = require('./config');
function wrap(arr, prefix = `[`, suffix = `]`) {
    return arr.map(i => `${prefix}${i}${suffix}`).join(' ');
}
function arrayfy(o) {
    return Array.isArray(o) ? o : [o];
}
let warningShown = false;
function showWarningIfDatabaseNotDefined() {
    if (!config.c3pr.mongoLogsUri && !warningShown) {
        console.log('Logs: MONGO_LOGS_URI env var is not defined. Printing to STDOUT only. (This message will be only printed once every 5mins.)');
        warningShown = true;
        setTimeout(() => warningShown = false, 5 * 60 * 1000).unref();
    }
}
async function logWithMeta(message, metadata, logMetas) {
    const nodeName = logMetas.find(logMeta => !!logMeta.nodeName).nodeName;
    const correlationIds = logMetas.reduce((acc, { correlationId, correlationIds }) => acc.concat(correlationId || []).concat(correlationIds || []), []);
    const moduleNames = logMetas.reduce((acc, { moduleName, moduleNames }) => acc.concat(moduleName || []).concat(moduleNames || []), []);
    await log(nodeName, correlationIds, moduleNames, message, metadata);
}
async function log(nodeName, correlationIds, moduleNames, message, metadata) {
    showWarningIfDatabaseNotDefined();
    console.log(wrap(correlationIds), wrap(moduleNames, '<', '>'), message);
    if (!config.c3pr.mongoLogsUri) {
        return;
    }
    const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);
    let logs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection + (c3prLOG.testModeActivated ? "-test" : ""));
    await logs.insertOne({ node: nodeName, dateTime: new Date().toISOString(), correlationIds, moduleNames, message, metadata });
    await client.close();
}
function isLogMeta(o) {
    return (!!o.correlationId || !!o.correlationIds) && (!!o.moduleName || !!o.moduleNames);
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
module.exports = c3prLOG;
//# sourceMappingURL=c3prLOG.js.map