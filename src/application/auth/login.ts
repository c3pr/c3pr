import { encodeUuidToken } from "./auth";
import { c3prBus } from '../bus/bus';
import { v4 as uuidv4 } from 'uuid';

function subscribe(subscriptions = []) {
    if (
        !Array.isArray(subscriptions) ||
        !subscriptions.every(({eventType, callbackUrl}) => eventType && callbackUrl)
    ) {
        throw new Error(`Your request payload must be a subscriptions array with the format: [{eventType, callbackUrl}].`);
    }
    subscriptions.forEach(({eventType, callbackUrl}) => {
        c3prBus.subscribeTo(eventType, callbackUrl);
    });
}

function anonymous() {
    console.log('WARNING: logged in without body.');
    return encodeUuidToken('anonymous//' + uuidv4());
}

function login(body) {
    if (!body) {
        return anonymous();
    }
    if (Array.isArray(body)) {
        subscribe(body);
        return anonymous();
    }

    if (!body.username) { throw new Error('Login requires a username. Received: ' + JSON.stringify(body)); }
    if (!body.password) { throw new Error('Login requires a password. Received: ' + JSON.stringify(body)); }
    subscribe(body.subscriptions);

    // TODO validate username + password here

    return encodeUuidToken(body.username);
}

export = login;