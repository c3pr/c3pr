const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');
const notifyC3prBotOfChanges = require('../domain/c3pr-bot/notifyC3prBotOfChanges');

function handleWebhook(webhookPayload) {
    console.log(`[${webhookPayload.after}] >>> Handling webhook invoked for ${webhookPayload.repository.clone_url} - m: ${webhookPayload.head_commit.message}...`);
    const changes = convertWebhookToChanges(webhookPayload);
    notifyC3prBotOfChanges(changes);
}

module.exports = handleWebhook;