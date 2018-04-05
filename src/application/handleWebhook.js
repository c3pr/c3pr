const c3prLOG = require("node-c3pr-logger");
const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');
const notifyC3prBotOfChanges = require('../domain/c3pr-bot/notifyC3prBotOfChanges');

function handleWebhook(webhookPayload) {
    c3prLOG('c3pr-repo-github', [webhookPayload.after], 'handleWebhook', `Handling webhook invoked for ${webhookPayload.repository.clone_url} - m: ${webhookPayload.head_commit.message}...`);
    const changes = convertWebhookToChanges(webhookPayload);
    notifyC3prBotOfChanges(changes);
}

module.exports = handleWebhook;