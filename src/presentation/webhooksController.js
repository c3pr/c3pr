const c3prLOG = require("node-c3pr-logger");
const handleWebhook = require('../application/webhook/handleWebhook').c3pr.handleWebhook;

module.exports = function (app) {

    app.post('/webhooks', function (request, response) {
        const webhookPayload = request.body;

        if (webhookPayload.object_kind === "push") {
            //console.log(JSON.stringify(webhookPayload));
            c3prLOG(
                `Received webhook for ${webhookPayload.repository.url}. Message: '${webhookPayload.commits && webhookPayload.commits[0].message}'.`,
                {nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'webhooksController'}
            );
            handleWebhook(webhookPayload);
        } else {
            c3prLOG(
                `Received webhook. Not a push: ${webhookPayload.object_kind}.`,
                {webhookPayload},
                {nodeName: 'c3pr-repo-gitlab', moduleName: 'webhooksController'}
            );
        }

        response.send('Ok, that would be all, thanks.');
    });

};