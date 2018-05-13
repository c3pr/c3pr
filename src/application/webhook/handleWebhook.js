const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const registerChanges = require('node-c3pr-repo/register-changes').c3pr.registerChanges;

const config = require('../../config');
const convertWebhookToChanges = require('./convertWebhookToChanges');

function handleWebhook(webhookPayload) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}];
    c3prLOG2({
        msg: `Handling webhook invoked for ${webhookPayload.repository.url}. Message: '${webhookPayload.commits[0].message}'.`,
        logMetas,
        meta: {webhookPayload}
    });

    const changes = convertWebhookToChanges(webhookPayload);

    return registerChanges(changes, {changesUrl: config.c3pr.changesUrl, jwt: config.c3pr.jwt, logMetas});
}

module.exports = {
    c3pr: {
        handleWebhook
    }
};