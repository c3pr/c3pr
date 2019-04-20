const express = require('express');
const bodyParser = require('body-parser');
import config from '../config';

import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
const lcid = c3prLOG4.lcid();
const sha = 'express';
const euuid = sha;

const app = express();

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send(`No C-3PR BRAIN endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.brain.c3prBrainPort, () => {
    c3prLOG4(`C-3PR BRAIN is up at port ${config.c3pr.brain.c3prBrainPort}.`, {lcid, sha, euuid});
});
