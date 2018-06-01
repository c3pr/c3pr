const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const handleWebhook = require('../application/handleWebhook/handleWebhook');


module.exports = function (app) {

    app.post('/webhooks', function (request, response) {
        handleWebhook(request.body);
        response.send('Webhook received, thanks.');
    });

};