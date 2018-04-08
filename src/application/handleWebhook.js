const c3prLOG = require("node-c3pr-logger");
const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');
const notifyC3prBotOfChanges = require('../domain/c3pr-bot/notifyC3prBotOfChanges');

function handleWebhook(webhookPayload) {
    c3prLOG(`Handling webhook invoked for ${webhookPayload.repository.clone_url} - m: ${webhookPayload.head_commit.message}...`, {webhookPayload}, {nodeName: 'c3pr-repo-github', correlationId: webhookPayload.after, moduleName: 'handleWebhook'});
    const changes = convertWebhookToChanges(webhookPayload);
    notifyC3prBotOfChanges(changes);
}

module.exports = handleWebhook;