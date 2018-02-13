const createHandler = require('github-webhook-handler');

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'myhashsecret';
const githubWebhookHandler = createHandler({path: '/webhook', secret: GITHUB_WEBHOOK_SECRET});

const handleWebhook = require('../application/handleWebhook');

githubWebhookHandler.on('error', function (err) {
    console.error('Error:', err.message)
});

githubWebhookHandler.on('push', function (event) {
    console.log(`[${event.payload.after}] [webhookListenerController] Received a push event for ${event.payload.repository.name} to ${event.payload.ref}`);
    handleWebhook(event.payload);
});

githubWebhookHandler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
});

module.exports = githubWebhookHandler;