const express = require('express');
const bodyParser = require('body-parser');

const c3prLOG = require("node-c3pr-logger");
const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;

const config = require('../config');

const app = express();

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send('This is the C3PR Agent (v. __C3PR_AGENT_EXECUTABLE_VERSION__). ' +
        `c3prLOG env var is ${!c3prLOG.isEnvVarSet() ? 'not' : ''} set. ` +
        `Btw, no endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.agent.port, () => {
    c3prLOG3(`c3pr-agent version __C3PR_AGENT_EXECUTABLE_VERSION__ now online with Agent ID: ${config.c3pr.agent.agentId}`, {ids: ['init']});
});
