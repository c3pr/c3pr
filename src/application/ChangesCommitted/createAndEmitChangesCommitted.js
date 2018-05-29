const convertWebhookToChanges = require('../ChangesCommitted/convertWebhookToChanges');
const emitChangesCommitted = require('../ChangesCommitted/emitChangesCommitted');

async function createAndEmitChangesCommitted(webhookPayload, logMetas) {
    const changesCommitted = await convertWebhookToChanges(webhookPayload);
    emitChangesCommitted(changesCommitted, logMetas);
}

module.exports = createAndEmitChangesCommitted;
