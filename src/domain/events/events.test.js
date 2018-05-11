const expect = require('chai').expect;

const config = require('../../config');
config.c3pr.hub.mongoEventsCollection += "-test";

const events = require('./events');
const eventsDB = require('./eventsDB');

describe('events', function () {

    it('register -> collect', async function () {
        /// given
        const EVENT_TYPE = "evtType";
        const payload = {a: 123};
        /// when
        await events.register(EVENT_TYPE, payload);
        /// then
        let evt = await events.collect(EVENT_TYPE);
        //
        expect(evt.eventType).to.deep.equal(EVENT_TYPE);
        expect(evt.payload).to.deep.equal(payload);
    }).timeout(4 * 1000);

    it('collect concurrently should not return multiple events', async function () {
        /// given
        const EVENT_TYPE = "evtType";
        const payload = {a: 123};
        await events.register(EVENT_TYPE, payload);

        /// when
        let returnedEvents = await Promise.all([events.collect(EVENT_TYPE), events.collect(EVENT_TYPE), events.collect(EVENT_TYPE)]);

        /// then
        expect(returnedEvents[0].eventType).to.deep.equal(EVENT_TYPE);
        expect(returnedEvents[0].payload).to.deep.equal(payload);
        expect(returnedEvents[1]).to.be.null;
        expect(returnedEvents[2]).to.be.null;

    }).timeout(4 * 1000);

    after(async () => {
        await eventsDB.close();
        console.log("After all!");
    })

});