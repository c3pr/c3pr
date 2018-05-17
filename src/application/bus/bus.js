const EventEmitter = require('events');
const axios = require('axios');

const config = require('../../config');

const hub = new EventEmitter();

function notify(callbackUrl, tryNumber, event_type, listener) {
    axios.post(callbackUrl).catch(() => {
        if (tryNumber > config.c3pr.hub.bus.maxRetries) {
            hub.removeListener(event_type, listener);
            return;
        }
        setTimeout(() => {
            notify(callbackUrl, tryNumber + 1, event_type, listener);
        }, config.c3pr.hub.bus.retryWaitingTimeInMs);
    });
}

function subscribeTo(event_type, callbackUrl) {
    const listener = () => notify(callbackUrl, 1, event_type, listener);
    hub.on(event_type, listener);
}

function emit(event_type) {
    hub.emit(event_type);
}

function clearListeners(event_type) {
    hub.removeAllListeners(event_type);
}

module.exports = {
    c3prBus: {
        subscribeTo,
        emit,
        clearListeners
    }
};