const mongodb = require('mongodb');
const expect = require('chai').expect;
const c3prLOG = require('./c3prLOG');

const config = require('./config');
const testLogsCollection = config.c3pr.mongoLogsCollection + '-test';
c3prLOG.testMode();


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('c3prLOG', () => {

    function go(title, ...logMeta) {
        it(title, async () => {
            const dateBefore = new Date().toISOString();
            await timeout(100);

            const someNumber = Math.random() * 999 + 1;
            const logMessage = 'someNumber --> ' + someNumber;

            await c3prLOG(logMessage, {stuff: 'yo2'}, ...logMeta);

            const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

            let logs = client.db(config.c3pr.mongoLogsDatabase).collection(testLogsCollection);
            const insertedLog = await logs.find({dateTime: {$gte: dateBefore}}).next();

            await client.close();

            expect(insertedLog.node).to.equal('nawde');
            expect(insertedLog.correlationIds).to.deep.equal(['test', 'idTwo']);
            expect(insertedLog.moduleNames).to.deep.equal(['logs-one', 'logs-two']);
            expect(insertedLog.message).to.equal(logMessage);
            expect(insertedLog.metadata).to.deep.equal({stuff: 'yo2'});
        }).timeout(10 * 1000);
    }

    go('should log logMeta (correlationIds)',
        {nodeName: 'nawde', correlationIds: ['test', 'idTwo'], moduleNames: ['logs-one', 'logs-two']}
    );
    go('should log logMeta (correlationId + correlationIds)',
        {nodeName: 'nawde', correlationId: 'test', correlationIds: ['idTwo'], moduleName: 'logs-one', moduleNames: ['logs-two']}
    );
    go('should log logMeta (logMetas + correlationId)',
        {nodeName: 'nawde', correlationId: 'test', moduleName: 'logs-one'}, {correlationId: 'idTwo', moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationIds)',
        {nodeName: 'nawde', correlationIds: ['test'], moduleName: 'logs-one'}, {correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationId + correlationIds)',
        {nodeName: 'nawde', correlationId: 'test', moduleName: 'logs-one'}, {correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + correlationIds not array)',
        {nodeName: 'nawde', correlationIds: 'test', moduleName: 'logs-one'}, {correlationIds: 'idTwo', moduleName: 'logs-two'}
    );
    go('should log logMeta (logMetas + nodeName on second)',
        {correlationId: 'test', moduleName: 'logs-one'}, {nodeName: 'nawde', correlationIds: ['idTwo'], moduleName: 'logs-two'}
    );


});