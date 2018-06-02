import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import handleWebhook = require('../application/handleWebhook/handleWebhook');


export = function (app) {

    app.post('/webhooks', function (request, response) {
        handleWebhook(request.body);
        response.send('Webhook received, thanks.');
    });

};