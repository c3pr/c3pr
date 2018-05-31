const login = require("../application/auth/login");

module.exports = function (app) {

    app.post('/api/v1/login', function (request, response) {
        try {
            const jwtToken = login(request.body);
            response.json(jwtToken);
        } catch (e) {
            response.status(400).send(e.toString());
        }
    });

};