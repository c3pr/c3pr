const express = require('express');
const bodyParser = require('body-parser');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const euuid = 'init';

const config = require('../config');

const app = express();

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send('This is the C3PR Agent (v. __C3PR_AGENT_EXECUTABLE_VERSION__). ' +
        `c3prLOG env var is ${!c3prLOG4.isEnvVarSet() ? 'not' : ''} set. ` +
        `Btw, no endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.agent.port, () => {
    c3prLOG4(`c3pr-agent version __C3PR_AGENT_EXECUTABLE_VERSION__ now online with Agent ID: ${config.c3pr.agent.agentId}`, {lcid, euuid});
});
