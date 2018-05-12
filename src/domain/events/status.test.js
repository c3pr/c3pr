const expect = require('chai').expect;
const uuidv4 = require('uuid/v4');

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const Status = require('./status');

describe('status', function () {

    let EVENT_TYPE;
    let uuid;
    let processorUUID;

    before(() => {
        EVENT_TYPE = "evtType" + Math.random();
        uuid = uuidv4();
        processorUUID = uuidv4();
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
        Status.addAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// then
        let evt = Status.currentlyProcessing(EVENT_TYPE, uuid);
        expect(evt.processorUUID).to.equal(processorUUID);
    });

    it('retrieveAllTimedOut big timeout', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        Status.addAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        const timedOut = Status.retrieveAllTimedOut(999999999999);
        /// then
        expect(timedOut).to.deep.equal([]);
    });

    it('retrieveAllTimedOut tiny timeout', () => {
        /// given
        Status.addAsUnprocessed(EVENT_TYPE, uuid);
        Status.addAsProcessing(EVENT_TYPE, uuid, processorUUID);
        /// when
        const timedOut = Status.retrieveAllTimedOut(-1);
        /// then
        expect(timedOut).to.deep.equal([{
            eventType: EVENT_TYPE,
            uuid
        }]);
    });

});