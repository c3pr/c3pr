import inboundPorts from "../../../ports/inbound";


export default function (app) {

    app.post('/webhooks', function (request, response) {
        // noinspection JSIgnoredPromiseFromCall
        inboundPorts.handleWebhook(request.body);
        response.send('Webhook received for processing, thanks.');
    });

};