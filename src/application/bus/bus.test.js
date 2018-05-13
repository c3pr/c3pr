const expect = require('chai').expect;

const uuidv4 = require('uuid/v4');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

const c3prBus = require('./bus').c3prBus;

const config = require('../../config');

describe('bus', function () {

    let eventType;

    before(() => {
        eventType = uuidv4();
    });

    after(() => {
        c3prBus.clearListeners(eventType);
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
        c3prBus.subscribeTo(eventType, "http://bob.com/subscriberOne");
        c3prBus.emit(eventType);
        /// then
        await postExpectation;
    });

    it('subscribeTo + callback error', async () => {
        /// setup
        let retry = -1;
        const postExpectation = new Promise(resolve => {
            axiosMock.onPost("http://bob.com/subscriberTwo").reply(function () {
                retry++;
                if (retry === config.c3pr.hub.bus.maxRetries) {
                    resolve();
                }
                return [500, {}, {'content-type': 'application/json'}];
            });
        });

        c3prBus.subscribeTo(eventType, "http://bob.com/subscriberTwo");
        c3prBus.emit(eventType);
        await postExpectation;

        /// when
        // we emit once more and hope it is not called again
        c3prBus.emit(eventType);

        /// then
        // if it is not called again, the retry number didn't change
        setTimeout(() => {
            expect(retry).to.equal(config.c3pr.hub.bus.maxRetries);
        }, 1000)
    }).timeout(99 * 1000);

});