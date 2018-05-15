const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

require('../application/login/login');

const app = express();

app.use(express.static('resources/public'));

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);
require('./changesController')(app);
require('./patchesController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`No C-3PR BRAIN endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.brain.c3prBrainPort, () => {
    const logMeta = {nodeName: 'c3pr-brain', correlationIds: 'boot', moduleName: 'main'};

    c3prLOG(`C-3PR BRAIN is up at port ${config.c3pr.brain.c3prBrainPort}.`, logMeta);
});
