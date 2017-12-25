const express = require('express');
const createHandler = require('github-webhook-handler');

const PORT = process.env.PORT || 5000;
const githubWebhookHandler = createHandler({path: '/webhook', secret: 'myhashsecret'});
const app = express();

app.use(githubWebhookHandler);
app.use(express.static('resources/public'));


githubWebhookHandler.on('error', function (err) {
    console.error('Error:', err.message)
});

githubWebhookHandler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref)
});

githubWebhookHandler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
});

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.send('No C3PR endpoint is listening at the requested location.', 404);
});

app.listen(PORT);
