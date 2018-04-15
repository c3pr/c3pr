const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5003;
const app = express();

app.use(bodyParser.json());

require('./c3prController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('This is the C3PR Agent (v. __C3PR_AGENT_EXECUTABLE_VERSION__). ' +
        `c3prLOG env var is ${!c3prLOG.isEnvVarSet() ? 'not' : ''} set.` +
        '. Btw, no endpoint is listening at the requested location.');
});


app.listen(PORT, () => {
    c3prLOG(`c3pr-agent version __C3PR_AGENT_EXECUTABLE_VERSION__ now listening at port ${PORT}.`, {nodeName: 'c3pr-agent', correlationIds: 'boot', moduleName: 'main'});
});
