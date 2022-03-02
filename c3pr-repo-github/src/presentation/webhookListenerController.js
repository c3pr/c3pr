const c3prLOG = require("node-c3pr-logger");
const createHandler = require('github-webhook-handler');

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'myhashsecret';
const githubWebhookHandler = createHandler({path: '/webhook', secret: GITHUB_WEBHOOK_SECRET});

const handleWebhook = require('../application/handleWebhook');

githubWebhookHandler.on('error', function (err) {
    console.error('Error:', err.message)
});

githubWebhookHandler.on('push', function (event) {
    c3prLOG(`Received a push event for ${event.payload.repository.name} to ${event.payload.ref}`, {nodeName: 'c3pr-repo-github', correlationId: event.payload.after, moduleName: 'webhookListenerController'});
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