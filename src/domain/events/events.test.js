const expect = require('chai').expect;

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const events = require('./events');
const eventsDB = require('./eventsDB');
const Status = require('./status');

describe('events', function () {

    let EVENT_TYPE;
    let payload;

    before(() => {
        EVENT_TYPE = "evtType" + Math.random();
        payload = {a: Math.random()};
    });

    it('register -> peekUnprocessed', async () => {
        /// given
        /// when
        await events.register(EVENT_TYPE, payload);
        /// then
        let evt = await events.peekUnprocessed(EVENT_TYPE);

        expect(evt.eventType).to.deep.equal(EVENT_TYPE);
        expect(evt.status).to.deep.equal(Status.UNPROCESSED);
        expect(evt.payload).to.deep.equal(payload);
    }).timeout(4 * 1000);

    it('find', async () => {
        let evt = await events.find(111111111111111111);
        expect(evt).to.deep.equal(Status.PROCESSING);
    }).timeout(4 * 1000);

    it('patchAsProcessing', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        await events.patchAsProcessing(EVENT_TYPE, uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.status).to.deep.equal(Status.PROCESSING);
    }).timeout(4 * 1000);

    it('patch and peek CONCURRENTLY should not return multiple events', async () => {
        /// given
        await events.register(EVENT_TYPE, payload);

        let {uuid} = await events.peekUnprocessed(EVENT_TYPE);

        /// when
        let returnedEvents = await Promise.all([events.patchAsProcessing(EVENT_TYPE, uuid), events.peekUnprocessed(EVENT_TYPE), events.peekUnprocessed(EVENT_TYPE)]);

        /// then
        expect(returnedEvents[1].uuid).to.equal(uuid);
        expect(returnedEvents[2].uuid).to.equal(uuid);
    }).timeout(4 * 1000);

    it('patchAsProcessed should throw error if evt is not PROCESSING', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.contain("not currently processing");
        }
    }).timeout(4 * 1000);

    it('patchAsProcessed', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid);
        /// when
        await events.patchAsProcessed(EVENT_TYPE, uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.status).to.equal(Status.PROCESSED);
    }).timeout(4 * 1000);

    after(async () => {
        await eventsDB.close();
    })

});