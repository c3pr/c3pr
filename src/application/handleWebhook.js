const handleWebhook = require('node-c3pr-repo/webhook/handleWebhook');

const config = require('../config');
const convertWebhookToChanges = require('../domain/webhook/convertWebhookToChanges');

module.exports = function (webhookPayload) {
    handleWebhook(config, convertWebhookToChanges, webhookPayload)
};