const express = require('express');
const webhookListenerController = require('./webhookListenerController');
const config = require('../config');

const app = express();

app.use(webhookListenerController);

app.use(express.static('resources/public'));

require('./prsController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.send('No C3PR endpoint is listening at the requested location.', 404);
});

app.listen(config.c3pr.port);
console.log(`c3pr-repo-github now listening at port ${config.c3pr.port}.`);
config.c3pr.print();
