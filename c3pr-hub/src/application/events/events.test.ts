import { expect } from 'chai';
const uuidv4 = require('uuid/v4');

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const events = require('./events');
const eventsDB = require('./eventsDB');
import Status from './status';

describe('events', function () {

    let EVENT_TYPE;
    let payload;
    let processor_uuid;
    let otherProcessorUUID;

    beforeEach(() => {
        EVENT_TYPE = "evtType" + Math.random();
        payload = {a: Math.random()};
        processor_uuid = uuidv4();
        otherProcessorUUID = uuidv4();
    });

    (it('register -> peekUnprocessed', async () => {
        /// given
        /// when
        await events.register(EVENT_TYPE, payload);
        /// then
        let evt = await events.peekUnprocessed(EVENT_TYPE);

        expect(evt.event_type).to.deep.equal(EVENT_TYPE);
        expect(evt.meta.status).to.deep.equal(Status.UNPROCESSED);
        expect(evt.payload).to.deep.equal(payload);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessing', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSING);
        expect(evt.meta.processor_uuid).to.equal(processor_uuid);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessing can be called multiple times, if using the same processor_uuid', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSING);
        expect(evt.meta.processor_uuid).to.equal(processor_uuid);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessing should error if called with a different processor_uuid', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        try {
            await events.patchAsProcessing(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is already being processed by processor_uuid '${processor_uuid}'. processor_uuid you sent me: '${otherProcessorUUID}'.`);
        }
    }) as any).timeout(6 * 1000);

    (it('patch and peek CONCURRENTLY should not return multiple events', async () => {
        /// given
        await events.register(EVENT_TYPE, payload);

        let {uuid} = await events.peekUnprocessed(EVENT_TYPE);

        /// when
        let returnedEvents = await Promise.all([events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid), events.peekUnprocessed(EVENT_TYPE), events.peekUnprocessed(EVENT_TYPE)]);

        /// then
        expect(returnedEvents[1].uuid).to.equal(uuid);
        expect(returnedEvents[2].uuid).to.equal(uuid);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessed', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        await events.patchAsProcessed(EVENT_TYPE, uuid, processor_uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSED);
        expect(evt.meta.processor_uuid).to.equal(processor_uuid);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessed should throw error if evt is not PROCESSING', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, processor_uuid);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is not currently being processed.`);
        }
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessed can be called multiple times, if using the same processor_uuid', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        await events.patchAsProcessed(EVENT_TYPE, uuid, processor_uuid);
        /// when
        await events.patchAsProcessed(EVENT_TYPE, uuid, processor_uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.PROCESSED);
        expect(evt.meta.processor_uuid).to.equal(processor_uuid);
    }) as any).timeout(6 * 1000);

    (it('patchAsProcessed should error if called with a different processor_uuid than when patchAsProcessing was called', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' is being processed by a different processor_uuid ('${processor_uuid}'), not the one you sent me ('${otherProcessorUUID}').`);
        }

    }) as any).timeout(6 * 1000);

    (it('patchAsProcessed should error if called with a different processor_uuid', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        await events.patchAsProcessed(EVENT_TYPE, uuid, processor_uuid);
        /// when
        try {
            await events.patchAsProcessed(EVENT_TYPE, uuid, otherProcessorUUID);
            expect.fail();
        } catch (e) {
            /// then
            expect(e.toString()).to.equal(`Error: Event of UUID '${uuid}' and type '${EVENT_TYPE}' has been processed by a different processor_uuid: ${processor_uuid}. processor_uuid you sent me: ${otherProcessorUUID}.`);
        }
    }) as any).timeout(6 * 1000);

    (it('patchAsUnprocessed', async () => {
        /// given
        let uuid = await events.register(EVENT_TYPE, payload);
        await events.patchAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        await events.patchAsUnprocessed(EVENT_TYPE, uuid);
        /// then
        let evt = await events.find(uuid);
        expect(evt.meta.status).to.equal(Status.UNPROCESSED);
        expect(evt.meta.processor_uuid).to.equal(null);
    }) as any).timeout(6 * 1000);

    afterAll(async () => {
        await eventsDB.close();
    })

});