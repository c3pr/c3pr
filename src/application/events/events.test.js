const expect = require('chai').expect;
const uuidv4 = require('uuid/v4');

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const events = require('./events');
const eventsDB = require('./eventsDB');
const Status = require('./status');

describe('events', function () {

    let EVENT_TYPE;
    let payload;
    let processorUUID;
    let otherProcessorUUID;

    before(() => {
        EVENT_TYPE = "evtType" + Math.random();
        payload = {a: Math.random()};
        processorUUID = uuidv4();
        otherProcessorUUID = uuidv4();
    });

    it('register -> peekUnprocessed', async () => {
        /// given
        /// when
        await events.register(EVENT_TYPE, payload);
        /// then
        let evt = await events.peekUnprocessed(EVENT_TYPE);

        expect(evt.eventType).to.deep.equal(EVENT_TYPE);
        expect(evt.meta.status).to.deep.equal(Status.UNPROCESSED);
        expect(evt.payload).to.deep.equal(payload);
    }).timeout(6 * 1000);

    it('patchAsProcessing', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSING);
        expect(evt.meta.processorUUID).to.equal(processorUUID);
    }).timeout(6 * 1000);

    it('patchAsProcessing can be called multiple times, if using the same processorUUID', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSING);
        expect(evt.meta.processorUUID).to.equal(processorUUID);
    }).timeout(6 * 1000);

    it('patchAsProcessing should error if called with a different processorUUID', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        try {
            await events.patchAsProcessing(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is already being processed by processorUUID '${processorUUID}'. processorUUID you sent me: '${otherProcessorUUID}'.`);
        }
    }).timeout(6 * 1000);

    it('patch and peek CONCURRENTLY should not return multiple events', async () => {
        /// given
        await events.register(EVENT_TYPE, payload);

        let {uuid} = await events.peekUnprocessed(EVENT_TYPE);

        /// when
        let returnedEvents = await Promise.all([events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID), events.peekUnprocessed(EVENT_TYPE), events.peekUnprocessed(EVENT_TYPE)]);

        /// then
        expect(returnedEvents[1].uuid).to.equal(uuid);
        expect(returnedEvents[2].uuid).to.equal(uuid);
    }).timeout(6 * 1000);

    it('patchAsProcessed', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        await events.patchAsProcessed(EVENT_TYPE, uuid, processorUUID);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSED);
        expect(evt.meta.processorUUID).to.equal(processorUUID);
    }).timeout(6 * 1000);

    it('patchAsProcessed should throw error if evt is not PROCESSING', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, processorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is not currently being processed.`);
        }
    }).timeout(6 * 1000);

    it('patchAsProcessed can be called multiple times, if using the same processorUUID', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        await events.patchAsProcessed(EVENT_TYPE, uuid, processorUUID);
        /// when
        await events.patchAsProcessed(EVENT_TYPE, uuid, processorUUID);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSED);
        expect(evt.meta.processorUUID).to.equal(processorUUID);
    }).timeout(6 * 1000);

    it('patchAsProcessed should error if called with a different processorUUID than when patchAsProcessing was called', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is being processed by a different processorUUID ('${processorUUID}'), not the one you sent me ('${otherProcessorUUID}').`);
        }

    }).timeout(6 * 1000);

    it('patchAsProcessed should error if called with a different processorUUID', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        await events.patchAsProcessed(EVENT_TYPE, uuid, processorUUID);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' has been processed by a different processorUUID: ${processorUUID}. processorUUID you sent me: ${otherProcessorUUID}.`);
        }
    }).timeout(6 * 1000);

    it('patchAsUnprocessed', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        await events.patchAsUnprocessed(EVENT_TYPE, uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.UNPROCESSED);
        expect(evt.meta.processorUUID).to.equal(null);
    }).timeout(6 * 1000);

    after(async () => {
        await eventsDB.close();
    })

});