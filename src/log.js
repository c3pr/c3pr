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

async function logObject(level, logOrLogs) {
    if (level !== 'debug') {
        console.log(colchetify([...logOrLogs.correlationIds, logOrLogs.scriptName]), logOrLogs.message);
    }
    const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

    let logs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection);

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
    info: (logOrLogsOrCorrIdS, scriptName, message, metadata) => log('info', logOrLogsOrCorrIdS, scriptName, message, metadata)
};