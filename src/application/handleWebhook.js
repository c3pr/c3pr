const c3prLOG = require("node-c3pr-logger");
const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');

const config = require('../config');
const notifyC3prBotOfChanges = require('node-c3pr-repo').changes.notifyC3prBotOfChanges;

function handleWebhook(webhookPayload) {
    c3prLOG(`Handling webhook invoked for ${webhookPayload.repository.clone_url} - m: ${webhookPayload.head_commit.message}...`,
        {webhookPayload}, {nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'});

    const changes = convertWebhookToChanges(webhookPayload);

    notifyC3prBotOfChanges(config, changes);
}

module.exports = handleWebhook;