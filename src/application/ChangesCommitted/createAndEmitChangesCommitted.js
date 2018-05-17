const convertWebhookToChanges = require('../ChangesCommitted/convertWebhookToChanges');
const emitChangesCommitted = require('../ChangesCommitted/emitChangesCommitted');

function createAndEmitChangesCommitted(webhookPayload, logMetas) {
    const changesCommitted = convertWebhookToChanges(webhookPayload);
    emitChangesCommitted(changesCommitted, logMetas);
}

module.exports = createAndEmitChangesCommitted;
