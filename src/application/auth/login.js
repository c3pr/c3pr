const encodeUuidToken = require("../auth/auth").encodeUuidToken;
const c3prBus = require('../bus/bus').c3prBus;

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

    if (!body.username) { throw new Error('Login requires a username.'); }
    if (!body.password) { throw new Error('Login requires a password.'); }
    subscribe(body.subscriptions);

    // TODO validate username + password here

    return encodeUuidToken(body.username);
}

module.exports = login;