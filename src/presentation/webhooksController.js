const c3prLOG = require("node-c3pr-logger");
const handlePrs = require('../application/handlePrs');

module.exports = function (app) {

    app.post('/webhooks', function (request, response) {
        const webhooks = request.body;

        console.log(JSON.stringify(webhooks));

        response.send('Ok, that would be all, thanks.');
    });

};