import convertWebhookToChanges = require('../ChangesCommitted/convertWebhookToChanges');
import emitChangesCommitted = require('../ChangesCommitted/emitChangesCommitted');

async function createAndEmitChangesCommitted(webhookPayload, logMetas = []) {
    const changesCommitted = await convertWebhookToChanges(webhookPayload);
    return emitChangesCommitted(changesCommitted, logMetas);
}

export = createAndEmitChangesCommitted;
