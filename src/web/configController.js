const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

const config = require('../config');

module.exports = function (app) {

    app.use('/api/v1/config', authExpressMiddleware);

    app.get('/api/v1/config', function (req, response) {
        response.status(200).send(config);
    });

};