import handleWebhook from '../application/handleWebhook/handleWebhook';


export = function (app) {

    app.post('/webhooks', function (request, response) {
        handleWebhook(request.body);
        response.send('Webhook received, thanks.');
    });

};