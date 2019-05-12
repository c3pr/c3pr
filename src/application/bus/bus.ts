import axios from 'axios';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import * as EventEmitter from 'events';

const config = require('../../config');

const hub = new EventEmitter();

const NEW_SUBSCRIBER = 'NEW_SUBSCRIBER';
const newSubscribers = new EventEmitter();

let listeners = [];

function removeListener(event_type, callbackUrl, listener, c3prLOG5) {
    c3prLOG5(`Removing due to MAX-RETRIES listener for event '${event_type}' the URL ${callbackUrl}.`);
    listeners = listeners.filter(ls => ls.listener !== listener);

    hub.removeListener(event_type, listener);
}

function notify(callbackUrl, tryNumber, event_type, listener, event_object, c3prLOG5) {
    c3prLOG5(`Notifying for event '${event_type}' the URL ${callbackUrl}.` + (tryNumber > 1 ? ` Try number ${tryNumber} of ${config.c3pr.hub.bus.maxRetries + 1}.` : ``));

    axios.post(callbackUrl).catch(() => {
        if (tryNumber > config.c3pr.hub.bus.maxRetries) {
            removeListener(event_type, callbackUrl, listener, c3prLOG5);
            return;
        }
        setTimeout(() => {
            notify(callbackUrl, tryNumber + 1, event_type, listener, event_object, c3prLOG5);
        }, config.c3pr.hub.bus.retryWaitingTimeInMs);
    });
}

export const _c3prBusSubscribeTo = (c3prLOG5) => (event_type, callbackUrl) => {
    const _c3prLOG5 = c3prLOG5({sha: '!hub-bus-subscribe-to'});
    _c3prLOG5(`Subscribing to event '${event_type}' the URL ${callbackUrl}.`);
    if (listeners.find(ls => ls.event_type === event_type && ls.callbackUrl === callbackUrl)) {
        _c3prLOG5(`URL ${callbackUrl} already subscribed to event '${event_type}'. Skipping.`);
    } else {
        const listener = (event_object, c3prLOG5) => notify(callbackUrl, 1, event_type, listener, event_object, c3prLOG5);
        hub.on(event_type, listener);
        listeners.push(Object.freeze({listener, event_type, callbackUrl}));
    }

    newSubscribers.emit(NEW_SUBSCRIBER, event_type);
};

export const _c3prBusEmit = (c3prLOG5) => (event_type, event_object) => {
    const _c3prLOG5 = c3prLOG5({
        sha: (event_object && event_object.payload &&  event_object.payload.repository && event_object.payload.repository.revision) || 'unknown-event-object',
        euuid: event_object && event_object.uuid || 'unknown-event-object'
    });
    _c3prLOG5(`Emitting '${event_type}'. Motivated by: ${JSON.stringify({..._c3prLOG5, lcid: undefined})}`);
    hub.emit(event_type, event_object, _c3prLOG5);
};

// used for testing
export function c3prBusClearListeners(event_type) {
    hub.removeAllListeners(event_type);
    listeners = [];
}

export const c3prBusEmit = _c3prBusEmit(c3prLOG5);
export const c3prBusSubscribeTo = _c3prBusSubscribeTo(c3prLOG5);

export const c3prBusOnNewSubscribers = (listener) => newSubscribers.on(NEW_SUBSCRIBER, (event_type) => listener(event_type));

export const c3prBusGetListeners = () => listeners.map(({event_type, callbackUrl}) => ({event_type, callbackUrl}));