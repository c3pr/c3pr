const jwt = require('jwt-simple');

const encodeUuidToken = require("../domain/auth/auth").encodeUuidToken;
const decodeToken = require("../domain/auth/auth").decodeToken;

module.exports = function (app) {

    // curl -sD - -X POST http://127.0.0.1:5000/api/v1/login
    app.post('/api/v1/login', function (request, response) {
        response.json(encodeUuidToken());
    });

    // curl -sD - -X POST --header "Authorization: Bearer <JWT>" http://127.0.0.1:5000/api/v1/login/test
    app.post('/api/v1/login/test', function ({headers}, response) {
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            response.send(decodeToken(headers.authorization.split(' ')[1]));
        } else {
            response.send("Did you really send a \"Authorization: Bearer JWT\" header?");
        }
    });

};