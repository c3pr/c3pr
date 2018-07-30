const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const euuid = 'express';

const app = express();

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send(`No C-3PR BRAIN endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.brain.c3prBrainPort, () => {
    const logMeta = {nodeName: 'c3pr-brain', correlationIds: 'boot', moduleName: 'main'};

    c3prLOG4(`C-3PR BRAIN is up at port ${config.c3pr.brain.c3prBrainPort}.`, {lcid, euuid});
});
