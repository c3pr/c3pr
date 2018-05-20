require("node-c3pr-logger").testMode();
const expect = require('chai').expect;

const uuidv4 = require('uuid/v4');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const c3prBus = require('./bus').c3prBus;

const config = require('../../config');

const flushPromises = require('util').promisify(setImmediate);

describe('bus', function () {

    let event_type;

    beforeEach(() => {
        event_type = uuidv4();
    });

    afterEach(() => {
        c3prBus.clearListeners(event_type);
    });

    it('subscribeTo + callback success', async () => {
        /// setup
        const postExpectation = new Promise(resolve => {
            axiosMock.onPost("http://bob.com/subscriberOne").reply(function () {
                resolve();
                return [200, {}, {'content-type': 'application/json'}];
            });
        });

        /// when
        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberOne");
        c3prBus.emit(event_type);
        /// then
        await postExpectation;
    });

    it('subscribeTo + callback error', async () => {
        /// setup
        let retryCount = -1;
        const retryCountHasReachedMaxRetries = new Promise(resolve => {
            axiosMock.onPost("http://bob.com/subscriberTwo").reply(function () {
                retryCount++;
                if (retryCount === config.c3pr.hub.bus.maxRetries) {
                    resolve();
                }
                return [500];
            });
        });

        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberTwo");
        c3prBus.emit(event_type);
        await retryCountHasReachedMaxRetries;
        await flushPromises();

        /// when
        // we emit once more and hope it is not called again
        c3prBus.emit(event_type);

        /// then
        // because it is not called again, then the retryCount number didn't change from when the retryCountHasReachedMaxRetries promise resolved
        expect(retryCount).to.equal(config.c3pr.hub.bus.maxRetries);
    }).timeout(15 * 1000);

    it('getListeners()', async () => {
        /// setup
        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberAAA");
        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberBBB");
        /// when
        const listeners = c3prBus.getListeners();
        /// then
        expect(listeners).to.deep.equal([
            {
                callbackUrl: "http://bob.com/subscriberAAA",
                event_type: event_type
            },
            {
                callbackUrl: "http://bob.com/subscriberBBB",
                event_type: event_type
            }
        ]);
    });

    it('callback error removes listener from getListeners()', async () => {
        /// setup
        let retryCount = -1;
        const retryCountHasReachedMaxRetries = new Promise(resolve => {
            axiosMock.onPost("http://bob.com/subscriberXYZ").reply(function () {
                retryCount++;
                if (retryCount === config.c3pr.hub.bus.maxRetries) {
                    resolve();
                }
                return [500];
            });
        });

        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberXYZ");
        expect(c3prBus.getListeners()).to.deep.equal([{callbackUrl: "http://bob.com/subscriberXYZ", event_type: event_type}]);

        /// when
        c3prBus.emit(event_type); // this will call the URL and fail many times until the listener is removed
        await retryCountHasReachedMaxRetries;
        await flushPromises();

        /// then
        expect(c3prBus.getListeners()).to.deep.equal([]);
    }).timeout(15 * 1000);

    it('subscribeTo should subscribe each url just once per event type', async () => {
        /// setup
        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberAAA");
        c3prBus.subscribeTo(event_type, "http://bob.com/subscriberAAA");
        /// when
        const listeners = c3prBus.getListeners();
        /// then
        expect(listeners).to.deep.equal([
            {
                callbackUrl: "http://bob.com/subscriberAAA",
                event_type: event_type
            }
        ]);
    });

});