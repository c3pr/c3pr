const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');
const notifyC3prBotOfChanges = require('../domain/c3pr-bot/notifyC3prBotOfChanges');

function handleWebhook(webhookPayload) {
    const changes = convertWebhookToChanges(webhookPayload);
    notifyC3prBotOfChanges(changes);
}

module.exports = handleWebhook;