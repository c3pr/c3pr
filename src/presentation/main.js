const express = require('express');
const webhookListenerController = require('./webhookListenerController');
const config = require('../config');

const app = express();

app.use(webhookListenerController);

app.use(express.static('resources/public'));

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.send('No C3PR endpoint is listening at the requested location.', 404);
});

console.log(`App listening at port ${config.c3pr.port}`);
app.listen(config.c3pr.port);
