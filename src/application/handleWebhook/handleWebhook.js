const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const handlePush = require('../handlePush/handlePush');
const handleMergeRequest = require('../handleMergeRequest/handleMergeRequest');


function handleWebhook(webhookPayload) {
    if (webhookPayload.object_kind === "push") {
        c3prLOG2({
            msg: `Received webhook for PUSH from ${webhookPayload.repository.git_http_url}. Message: '${webhookPayload.commits && webhookPayload.commits[0].message.trim()}'.`,
            logMetas: [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}]
        });
        handlePush(webhookPayload);
    } else if (webhookPayload.object_kind === "merge_request") {
        c3prLOG2({
            msg: `Received webhook for MERGE REQUEST from ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes && webhookPayload.object_attributes.title.trim()}'.`,
            logMetas: [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}]
        });
        handleMergeRequest(webhookPayload);
    } else {
        c3prLOG2({
            msg: `Received webhook. Not a known type: ${webhookPayload.object_kind}.`,
            logMetas: [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handleWebhook'}],
            meta: {webhookPayload},
        });
    }
}

module.exports = handleWebhook;