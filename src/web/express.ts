const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config');

import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
const lcid = c3prLOG4.lcid();
const sha = 'hub-express-init';
const euuid = sha;

const app = express();

app.use(bodyParser.json());

app.use(cors());

require('./configController')(app);
require('./agentRegistryController')(app);
require('./busController')(app);
require('./eventsController')(app);
require('./loginController')(app);
require('./projectsController')(app);
require('./logsController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`No C-3PR hub endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.hub.port, () => {
    c3prLOG4(`C-3PR hub is up at port ${config.c3pr.hub.port}.`, {lcid, sha, euuid});
});
