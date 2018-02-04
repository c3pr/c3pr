const createHandler = require('github-webhook-handler');

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'myhashsecret';
const githubWebhookHandler = createHandler({path: '/webhook', secret: GITHUB_WEBHOOK_SECRET});

githubWebhookHandler.on('error', function (err) {
    console.error('Error:', err.message)
});

githubWebhookHandler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);

    console.log('\n----------------\n');
    console.log(JSON.stringify(event.payload, null, 2));
    console.log('\n----------------\n');
});

githubWebhookHandler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
});

module.exports = githubWebhookHandler;