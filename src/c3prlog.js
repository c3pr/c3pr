const mongodb = require('mongodb');
const config = require('./config');

function colchetify(arr) {
    return arr.map(i => `[${i}]`).join(' ');
}

async function logManyParameters(nodeName, correlationIdOrCorrelationIds, scriptName, message, metadata) {
    const correlationIds = Array.isArray(correlationIdOrCorrelationIds) ? correlationIdOrCorrelationIds : [correlationIdOrCorrelationIds];
    return logObject(nodeName, {
        correlationIds,
        scriptName,
        message,
        metadata
    });
}

let warningShown = false;

async function logObject(nodeName, logOrLogs) {
    if (!config.c3pr.mongoLogsUri && !warningShown) {
        console.log('Logs: MONGO_LOGS_URI env var is not defined. Printing to STDOUT only. (This message will be only printed once every 5mins.)');
        warningShown = true;
        setTimeout(() => warningShown = false, 5 * 60 * 1000).unref();
    }
    if (!config.c3pr.mongoLogsUri) {
        console.log(colchetify([...logOrLogs.correlationIds, logOrLogs.scriptName]), logOrLogs.message);
    }
    if (!config.c3pr.mongoLogsUri) {
        return;
    }
    const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

    let logs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection + (c3prlog.testModeActivated ? "-test" : ""));

    if (Array.isArray(logOrLogs)) {
        const logsWithNodeAndDate = logOrLogs.map(log => addNodeAndDate(nodeName, log));
        await logs.insertMany(logsWithNodeAndDate);
    } else {
        await logs.insertOne(addNodeAndDate(nodeName, logOrLogs));
    }

    await client.close();
}

const isNonArrayObject = o => !Array.isArray(o) && typeof o === 'object';
const isObjectArray = o => Array.isArray(o) && o.length > 0 && isNonArrayObject(o[0]);

async function c3prlog(nodeName, logOrLogsOrCorrIdS, scriptName, message, metadata) {
    if (isNonArrayObject(logOrLogsOrCorrIdS)) { // log
        return logObject(nodeName, logOrLogsOrCorrIdS);
    } else if (isObjectArray(logOrLogsOrCorrIdS)) { // logs
        return logObject(nodeName, logOrLogsOrCorrIdS);
    } else { // corrId or corrIds
        return logManyParameters(nodeName, logOrLogsOrCorrIdS, scriptName, message, metadata);
    }
}
c3prlog.testMode = () => c3prlog.testModeActivated = true;

function addNodeAndDate(nodeName, log) {
    return {node: nodeName, dateTime: new Date().toISOString(), ...log};
}

module.exports = c3prlog;