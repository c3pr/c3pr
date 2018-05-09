const c3prLOG = require("node-c3pr-logger");

const notifyC3prBotOfChanges = require('../src/changes/notifyC3prBotOfChanges');

function handleWebhook(config, convertWebhookToChanges, webhookPayload, ...logMetas) {
    c3prLOG(
        `Handling webhook invoked for ${webhookPayload.repository.url}. Message: '${webhookPayload.commits[0].message}'.`,
        {webhookPayload},
        ...logMetas, {nodeName: 'node, c3pr-repo', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}
    );

    const changes = convertWebhookToChanges(webhookPayload);

    notifyC3prBotOfChanges(config, changes);
}

module.exports = handleWebhook;