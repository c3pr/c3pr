const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const handlePush = require('../handlePush/handlePush');


function handleWebhook(webhookPayload) {
    if (webhookPayload.object_kind === "push") {
        c3prLOG2({
            msg: `Received webhook for ${webhookPayload.repository.git_http_url}. Message: '${webhookPayload.commits && webhookPayload.commits[0].message.trim()}'.`,
            logMetas: [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}]
        });
        handlePush(webhookPayload);
    } else {
        c3prLOG2({
            msg: `Received webhook. Not a push: ${webhookPayload.object_kind}.`,
            logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handleWebhook'}],
            meta: {webhookPayload},
        });
    }
}

module.exports = handleWebhook;