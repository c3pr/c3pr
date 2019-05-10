import { expect } from 'chai';
import {c3prBusClearListeners, _c3prBusEmit, c3prBusGetListeners, _c3prBusSubscribeTo} from "./bus";

const uuidv4 = require('uuid/v4');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const config = require('../../config');

const flushPromises = require('util').promisify(setImmediate);

const logDummy = () => logDummy;
const c3prBusEmit = _c3prBusEmit(logDummy);
const c3prBusSubscribeTo = _c3prBusSubscribeTo(logDummy);

describe('bus', function () {

    let event_type, event_object;

    beforeEach(() => {
        event_type = uuidv4();
        event_object = {uuid: uuidv4(), payload_for: event_type, payload: {repository: {revision: 'the-sha'}}};
    });

    afterEach(() => {
        c3prBusClearListeners(event_type);
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
        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberOne");
        c3prBusEmit(event_type, event_object);
        /// then
        await postExpectation;
    });

    (it('subscribeTo + callback error', async () => {
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

        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberTwo");
        c3prBusEmit(event_type, event_object);
        await retryCountHasReachedMaxRetries;
        await flushPromises();

        /// when
        // we emit once more and hope it is not called again
        c3prBusEmit(event_type, event_object);

        /// then
        // because it is not called again, then the retryCount number didn't change from when the retryCountHasReachedMaxRetries promise resolved
        expect(retryCount).to.equal(config.c3pr.hub.bus.maxRetries);
    }) as any).timeout(15 * 1000);

    it('getListeners()', async () => {
        /// setup
        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberAAA");
        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberBBB");
        /// when
        const listeners = c3prBusGetListeners();
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

    (it('callback error removes listener from getListeners()', async () => {
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

        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberXYZ");
        expect(c3prBusGetListeners()).to.deep.equal([{callbackUrl: "http://bob.com/subscriberXYZ", event_type: event_type}]);

        /// when
        c3prBusEmit(event_type, event_object); // this will call the URL and fail many times until the listener is remov, event_payloaded
        await retryCountHasReachedMaxRetries;
        await flushPromises();

        /// then
        expect(c3prBusGetListeners()).to.deep.equal([]);
    }) as any).timeout(15 * 1000);

    it('subscribeTo should subscribe each url just once per event type', async () => {
        /// setup
        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberAAA");
        c3prBusSubscribeTo(event_type, "http://bob.com/subscriberAAA");
        /// when
        const listeners = c3prBusGetListeners();
        /// then
        expect(listeners).to.deep.equal([
            {
                callbackUrl: "http://bob.com/subscriberAAA",
                event_type: event_type
            }
        ]);
    });

});