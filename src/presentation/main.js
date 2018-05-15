const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

const hubRegistryBroadcast = require('../application/hubRegistryBroadcast');

const app = express();

app.use(bodyParser.json());

require('./c3prController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('This is the C3PR Agent (v. __C3PR_AGENT_EXECUTABLE_VERSION__). ' +
        `c3prLOG env var is ${!c3prLOG.isEnvVarSet() ? 'not' : ''} set. ` +
        `Btw, no endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.agent.port, () => {
    const logMeta = {nodeName: 'c3pr-agent', correlationIds: 'boot', moduleName: 'main'};

    c3prLOG(`c3pr-agent version __C3PR_AGENT_EXECUTABLE_VERSION__ now online with Agent ID: ${config.c3pr.agent.agentId}`, logMeta);

    hubRegistryBroadcast();

});
