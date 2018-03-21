const mongodb = require('mongodb');
const expect = require('chai').expect;
const log = require('./log');

const config = require('./config');
config.c3pr.mongoLogsCollection += '-test';


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('log', () => {

    it('should log object', async () => {
        const dateBefore = new Date().toISOString();
        await timeout(100);

        const someNumber = Math.random() * 999 + 1;
        const logMessage = 'someNumber --> ' + someNumber;

        await log.info({correlationIds: ['test'], scriptName: 'logs', message: logMessage, metadata: {stuff: 'yo'}});

        const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

        let songs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection);
        const insertedLog = await songs.find({dateTime: {$gte: dateBefore}}).next();

        await client.close();

        expect(insertedLog.correlationIds).to.deep.equal(['test']);
        expect(insertedLog.scriptName).to.equal('logs');
        expect(insertedLog.message).to.equal(logMessage);
        expect(insertedLog.metadata).to.deep.equal({stuff: 'yo'});
    }).timeout(10 * 1000);

    it('should log id string', async () => {
        const dateBefore = new Date().toISOString();
        await timeout(100);

        const someNumber = Math.random() * 999 + 1;
        const logMessage = 'someNumber --> ' + someNumber;

        await log.info('test', 'logs', logMessage, {stuff: 'yo'});

        const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

        let songs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection);
        const insertedLog = await songs.find({dateTime: {$gte: dateBefore}}).next();

        await client.close();

        expect(insertedLog.correlationIds).to.deep.equal(['test']);
        expect(insertedLog.scriptName).to.equal('logs');
        expect(insertedLog.message).to.equal(logMessage);
        expect(insertedLog.metadata).to.deep.equal({stuff: 'yo'});
    }).timeout(10 * 1000);


    it('should log ids array', async () => {
        const dateBefore = new Date().toISOString();
        await timeout(100);

        const someNumber = Math.random() * 999 + 1;
        const logMessage = 'someNumber --> ' + someNumber;

        await log.info(['test', 'idTwo'], 'logs', logMessage, {stuff: 'yo'});

        const client = await mongodb.MongoClient.connect(config.c3pr.mongoLogsUri);

        let songs = client.db(config.c3pr.mongoLogsDatabase).collection(config.c3pr.mongoLogsCollection);
        const insertedLog = await songs.find({dateTime: {$gte: dateBefore}}).next();

        await client.close();

        expect(insertedLog.correlationIds).to.deep.equal(['test', 'idTwo']);
        expect(insertedLog.scriptName).to.equal('logs');
        expect(insertedLog.message).to.equal(logMessage);
        expect(insertedLog.metadata).to.deep.equal({stuff: 'yo'});
    }).timeout(10 * 1000);

});