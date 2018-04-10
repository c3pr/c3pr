const mongodb = require('mongodb');
const expect = require('chai').expect;
const c3prLOG = require('./c3prLOG');

const config = require('./config');
const testLogsCollection = config.c3pr.mongoLogsCollection + '-test';
c3prLOG.testMode();


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function verify(title, {nodeName, correlationIds, moduleNames, meta}, ...logMetas) {
    it(title, async () => {
        const dateBefore = new Date().toISOString();
        await timeout(100);

        const someNumber = Math.random() * 999 + 1;
        const logMessage = 'someNumber --> ' + someNumber;

        await c3prLOG(logMessage, ...logMetas);

        const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

        let logs = client.db(config.c3pr.mongoLogsDatabase).collection(testLogsCollection);
        const insertedLog = await logs.find({dateTime: {$gte: dateBefore}}).next();

        await client.close();

        expect(insertedLog.node).to.deep.equal(nodeName);
        expect(insertedLog.correlationIds).to.deep.equal(correlationIds);
        expect(insertedLog.moduleNames).to.deep.equal(moduleNames);
        expect(insertedLog.message).to.deep.equal(logMessage);
        if (meta)
            expect(insertedLog.metadata).to.deep.equal(meta);
    }).timeout(10 * 1000);
}

function go(title, hasMeta, ...logMetas) {
    verify(title, {nodeName: "nawde", correlationIds: ['test', 'idTwo'], moduleNames: ['logs-one', 'logs-two'], meta: hasMeta && logMetas[0]}, ...logMetas);
}

describe('c3prLOG', () => {

    verify('no log should log default', {nodeName: "empty-logMeta-nodeName", correlationIds: ["empty-logMeta-correlationIds"], moduleNames: ["empty-logMeta-moduleNames"]});

    verify('empty log should log default', {nodeName: "empty-logMeta-nodeName", correlationIds: ["empty-logMeta-correlationIds"], moduleNames: ["empty-logMeta-moduleNames"]}, {});

    verify('present log, but no nodeName should not error',
        {nodeName: "empty-nodeName", correlationIds: ["ci"], moduleNames: ["mn"]}, {correlationIds: ["ci"], moduleNames: ["mn"]}
    );

    go('should log logMeta (correlationIds)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationIds: ['test', 'idTwo'], moduleNames: ['logs-one', 'logs-two']}
    );
    go('should log logMeta (NO METADATA) (correlationIds)',
        false, {nodeName: 'nawde', correlationIds: ['test', 'idTwo'], moduleNames: ['logs-one', 'logs-two']}
    );
    go('should log logMeta (correlationId + correlationIds)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationId: 'test', correlationIds: ['idTwo'], moduleName: 'logs-one', moduleNames: ['logs-two']}
    );
    go('should log logMeta (logMetas + correlationId)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationId: 'test', moduleName: 'logs-one'}, {correlationId: 'idTwo', moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationIds)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationIds: ['test'], moduleName: 'logs-one'}, {correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationId + correlationIds)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationId: 'test', moduleName: 'logs-one'}, {correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationIds not array)',
        true, {stuff: 'yo2'}, {nodeName: 'nawde', correlationIds: 'test', moduleName: 'logs-one'}, {correlationIds: 'idTwo', moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + nodeName on second)',
        true, {stuff: 'yo2'}, {correlationId: 'test', moduleName: 'logs-one'}, {nodeName: 'nawde', correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );

});