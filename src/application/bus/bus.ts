import axios from 'axios';
import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

const EventEmitter = require('events');

const config = require('../../config');

const lcid = c3prLOG4.lcid();
const sha = 'hub-bus';
const euuid = sha;

const hub = new EventEmitter();

const NEW_SUBSCRIBER = 'NEW_SUBSCRIBER';
const newSubscribers = new EventEmitter();

let listeners = [];

function removeListener(event_type, callbackUrl, listener) {
    c3prLOG4(`Removing due to MAX-RETRIES listener for event '${event_type}' the URL ${callbackUrl}.`, {lcid, sha, euuid});
    listeners = listeners.filter(ls => ls.listener !== listener);

    hub.removeListener(event_type, listener);
}

function notify(callbackUrl, tryNumber, event_type, listener) {
    c3prLOG4(`Notifying for event '${event_type}' the URL ${callbackUrl}.` + (tryNumber > 1 ? ` Try number ${tryNumber} of ${config.c3pr.hub.bus.maxRetries + 1}.` : ``), {lcid, sha, euuid});

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
    c3prLOG4(`Subscribing to event '${event_type}' the URL ${callbackUrl}.`, {lcid, sha, euuid});
    if (listeners.find(ls => ls.event_type === event_type && ls.callbackUrl === callbackUrl)) {
        c3prLOG4(`URL ${callbackUrl} already subscribed to event '${event_type}'. Skipping.`, {lcid, sha, euuid});
    } else {
        const listener = () => notify(callbackUrl, 1, event_type, listener);
        hub.on(event_type, listener);
        listeners.push(Object.freeze({listener, event_type, callbackUrl}));
    }

    newSubscribers.emit(NEW_SUBSCRIBER, event_type);
}

function emit(event_type) {
    c3prLOG4(`Emitting '${event_type}'.`, {lcid, sha, euuid});
    hub.emit(event_type);
}

function clearListeners(event_type) {
    hub.removeAllListeners(event_type);
    listeners = [];
}

export let c3prBus = {
    subscribeTo,
    emit,
    clearListeners,
    getListeners: () => listeners.map(({event_type, callbackUrl}) => ({event_type, callbackUrl})),
    onNewSubscribers: (listener) => newSubscribers.on(NEW_SUBSCRIBER, (event_type) => listener(event_type))
};