const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const EventEmitter = require('events');

const config = require('../../config');
const logMetas = [{nodeName: 'c3pr-hub', moduleName: 'bus'}];

const hub = new EventEmitter();

const NEW_SUBSCRIBER = 'NEW_SUBSCRIBER';
const newSubscribers = new EventEmitter();

let listeners = [];

function removeListener(event_type, callbackUrl, listener) {
    c3prLOG2({msg: `Removing due to MAX-RETRIES listener for event '${event_type}' the URL ${callbackUrl}.`, logMetas});
    listeners = listeners.filter(ls => ls.listener !== listener);

    hub.removeListener(event_type, listener);
}

function notify(callbackUrl, tryNumber, event_type, listener) {
    c3prLOG2({msg: `Notifying for event '${event_type}' the URL ${callbackUrl}.` + (tryNumber > 1 ? ` Try number ${tryNumber} of ${config.c3pr.hub.bus.maxRetries + 1}.` : ``), logMetas});
    // noinspection JSUnresolvedFunction
    axios.post(callbackUrl).catch(() => {
        if (tryNumber > config.c3pr.hub.bus.maxRetries) {
            removeListener(event_type, callbackUrl, listener);
            return;
        }
        setTimeout(() => {
            notify(callbackUrl, tryNumber + 1, event_type, listener);
        }, config.c3pr.hub.bus.retryWaitingTimeInMs);
    });
}

function subscribeTo(event_type, callbackUrl) {
    c3prLOG2({msg: `Subscribing to event '${event_type}' the URL ${callbackUrl}.`, logMetas});
    if (listeners.find(ls => ls.event_type === event_type && ls.callbackUrl === callbackUrl)) {
        c3prLOG2({msg: `URL ${callbackUrl} already subscribed to event '${event_type}'. Skipping.`, logMetas});
        return;
    }
    const listener = () => notify(callbackUrl, 1, event_type, listener);
    hub.on(event_type, listener);
    listeners.push(Object.freeze({listener, event_type, callbackUrl}));

    newSubscribers.emit(NEW_SUBSCRIBER, event_type);
}

function emit(event_type) {
    c3prLOG2({msg: `Emitting '${event_type}'.`, logMetas});
    hub.emit(event_type);
}

function clearListeners(event_type) {
    hub.removeAllListeners(event_type);
    listeners = [];
}

module.exports = {
    c3prBus: {
        subscribeTo,
        emit,
        clearListeners,
        getListeners: () => listeners.map(({event_type, callbackUrl}) => ({event_type, callbackUrl})),
        onNewSubscribers: (listener) => newSubscribers.on(NEW_SUBSCRIBER, (event_type) => listener(event_type))
    }
};