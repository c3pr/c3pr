const EventEmitter = require('events');
const axios = require('axios');

const config = require('../../config');

const hub = new EventEmitter();

function notify(callbackUrl, tryNumber, eventType, listener) {
    axios.post(callbackUrl).catch(() => {
        if (tryNumber > config.c3pr.hub.bus.maxRetries) {
            hub.removeListener(eventType, listener);
            return;
        }
        setTimeout(() => {
            notify(callbackUrl, tryNumber + 1, eventType, listener);
        }, config.c3pr.hub.bus.retryWaitingTimeInMs);
    });
}

function subscribeTo(eventType, callbackUrl) {
    const listener = () => notify(callbackUrl, 1, eventType, listener);
    hub.on(eventType, listener);
}

function emit(eventType) {
    hub.emit(eventType);
}

function clearListeners(eventType) {
    hub.removeAllListeners(eventType);
}

module.exports = {
    c3prBus: {
        subscribeTo,
        emit,
        clearListeners
    }
};