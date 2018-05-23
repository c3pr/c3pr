const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const handleWebhook = require('../application/webhook/handleWebhook').c3pr.handleWebhook;


module.exports = function (app) {

    app.post('/webhooks', function (request, response) {
        const webhookPayload = request.body;

        if (webhookPayload.object_kind === "push") {
            //console.log(JSON.stringify(webhookPayload));
            c3prLOG2({
                msg: `Received webhook for ${webhookPayload.repository.url}. Message: '${webhookPayload.commits && webhookPayload.commits[0].message.trim()}'.`,
                logMetas: [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'webhooksController'}]
            });
            handleWebhook(webhookPayload);
        } else {
            c3prLOG2({
                msg: `Received webhook. Not a push: ${webhookPayload.object_kind}.`,
                logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'webhooksController'}],
                meta: {webhookPayload},
            });
        }

        response.send('Ok, thanks.');
    });

};