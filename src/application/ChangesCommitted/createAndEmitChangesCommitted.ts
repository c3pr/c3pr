import convertWebhookToChanges = require('../ChangesCommitted/convertWebhookToChanges');
import emitChangesCommitted = require('../ChangesCommitted/emitChangesCommitted');

async function createAndEmitChangesCommitted(webhookPayload, logMetas = []) {
    const changesCommitted = await convertWebhookToChanges(webhookPayload);
    if (changesCommitted === null) {
        // no changed_files
        return;
    }
    return emitChangesCommitted(changesCommitted, logMetas);
}

export { createAndEmitChangesCommitted };
