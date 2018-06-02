const expect = require('chai').expect;
const uuidv4 = require('uuid/v4');

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const Status = require('./status');

describe('status', function () {

    let EVENT_TYPE;
    let uuid;
    let processor_uuid;

    before(() => {
        EVENT_TYPE = "evtType" + Math.random();
        uuid = uuidv4();
        processor_uuid = uuidv4();
    });

    it('addAsUnprocessed', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        /// when
        const evt = Status.peekUnprocessedEventOfType(EVENT_TYPE);
        /// then
        expect(evt).to.equal(uuid);
    });

    it('addAsProcessing', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        /// when
        Status.addAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// then
        let evt = Status.currentlyProcessing(EVENT_TYPE, uuid);
        expect(evt.processor_uuid).to.equal(processor_uuid);
    });

    it('addAsProcessing should remove event from unprocessed list', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        Status.addAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        let evt = Status.currentlyProcessing(EVENT_TYPE, uuid);
        expect(evt.processor_uuid).to.equal(processor_uuid);
        /// when
        const unprocessed = Status.peekUnprocessedEventOfType(EVENT_TYPE);
        /// then
        expect(unprocessed).to.equal(undefined);
    });

    it('retrieveAllTimedOut big timeout', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        Status.addAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        const timedOut = Status.retrieveAllTimedOut(999999999999);
        /// then
        expect(timedOut).to.deep.equal([]);
    });

    it('retrieveAllTimedOut tiny timeout', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        Status.addAsProcessing(EVENT_TYPE, uuid, processor_uuid);
        /// when
        const timedOut = Status.retrieveAllTimedOut(-1);
        /// then
        expect(timedOut).to.deep.equal([{
            event_type: EVENT_TYPE,
            uuid
        }]);
    });

});