const encodeUuidToken = require("../domain/auth/auth").encodeUuidToken;
const decodeToken = require("../domain/auth/auth").decodeToken;

const c3prBus = require('../application/bus/bus').c3prBus;

module.exports = function (app) {

    // curl -sD - -X POST http://127.0.0.1:5000/api/v1/login
    app.post('/api/v1/login', function (request, response) {
        if (!Array.isArray(request.body)) {
            response.status(400).send(`Your request payload must be a subscriptions array with the format: [{eventType, callbackUrl}].`);
            return;
        }
        request.body.subscriptions.forEach(({eventType, callbackUrl}) => {
            c3prBus.subscribeTo(eventType, callbackUrl);
        });
        response.json(encodeUuidToken());
    });

    // curl -sD - -X POST --header "Authorization: Bearer <JWT>" http://127.0.0.1:5000/api/v1/login/test
    /** @namespace headers.authorization */
    app.post('/api/v1/login/test', function ({headers}, response) {
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            response.send(decodeToken(headers.authorization.split(' ')[1]));
        } else {
            response.send("Did you really send a \"Authorization: Bearer JWT\" header?");
        }
    });

};