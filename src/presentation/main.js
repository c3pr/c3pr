const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const axios = require('axios');

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

    c3prLOG(`c3pr-agent version __C3PR_AGENT_EXECUTABLE_VERSION__ now listening at ${config.c3pr.agent.agentUrl}.
Tool ID: ${config.c3pr.agent.toolId}`, logMeta);
    console.log();

    c3prLOG(`Now broadcasting to C-3PR registry.`, logMeta);
    setInterval(() => {
        axios.patch(config.c3pr.registryUrl, {key: `agent//${config.c3pr.agent.toolId}`, value: config.c3pr.agent.agentUrl, timeout: 13 * 1000})
    }, 10 * 1000);

});
