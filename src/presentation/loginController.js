const uuidv4 = require('uuid/v4');


module.exports = function (app) {

    // curl -sD - -X POST http://127.0.0.1:5000/api/v1/login
    app.post('/api/v1/login', function (request, response) {
        response.json(uuidv4());
    });

};