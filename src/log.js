const mongodb = require('mongodb');
const config = require('./config');

function colchetify(arr) {
    return arr.map(i => `[${i}]`).join(' ');
}

async function logManyParameters(level, correlationIdOrCorrelationIds, scriptName, message, metadata) {
    const correlationIds = Array.isArray(correlationIdOrCorrelationIds) ? correlationIdOrCorrelationIds : [correlationIdOrCorrelationIds];
    return logObject(level, {
        correlationIds,
        scriptName,
        message,
        metadata
    });
}

let warningShown = false;

async function logObject(level, logOrLogs) {
    if (!config.c3pr.mongoLogsUri && !warningShown) {
        console.log('Logs: MONGO_LOGS_URI env var is not defined. Printing to STDOUT only. (This message will be only printed once every 5mins.)');
        warningShown = true;
        setTimeout(() => warningShown = false, 5 * 60 * 1000).unref();
    }
    if (level !== 'debug' || !config.c3pr.mongoLogsUri) {
        console.log(colchetify([...logOrLogs.correlationIds, logOrLogs.scriptName]), logOrLogs.message);
    }
    if (!config.c3pr.mongoLogsUri) {
        return;
    }
    const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

    let logs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection + (log.testMode ? "-test" : ""));

    if (Array.isArray(logOrLogs)) {
        const logsWithLevelAndDate = logOrLogs.map(log => addDateAndLevel(level, log));
        await logs.insertMany(logsWithLevelAndDate);
    } else {
        await logs.insertOne(addDateAndLevel(level, logOrLogs));
    }

    await client.close();
}

const isNonArrayObject = o => !Array.isArray(o) && typeof o === 'object';
const isObjectArray = o => Array.isArray(o) && o.length > 0 && isNonArrayObject(o[0]);

async function log(level, logOrLogsOrCorrIdS, scriptName, message, metadata) {
    if (isNonArrayObject(logOrLogsOrCorrIdS)) { // log
        return logObject(level, logOrLogsOrCorrIdS);
    } else if (isObjectArray(logOrLogsOrCorrIdS)) { // logs
        return logObject(level, logOrLogsOrCorrIdS);
    } else { // corrId or corrIds
        return logManyParameters(level, logOrLogsOrCorrIdS, scriptName, message, metadata);
    }
}

function addDateAndLevel(level, log) {
    return {level: level, dateTime: new Date().toISOString(), ...log};
}

module.exports = {
    debug: (logOrLogsOrCorrIdS, scriptName, message, metadata) => log('debug', logOrLogsOrCorrIdS, scriptName, message, metadata),
    info: (logOrLogsOrCorrIdS, scriptName, message, metadata) => log('info', logOrLogsOrCorrIdS, scriptName, message, metadata),
    testMode: () => log.testMode = true
};