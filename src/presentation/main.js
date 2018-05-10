const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const axios = require('axios');

const app = express();

app.use(express.static('resources/public'));

app.use(bodyParser.json());

require('./changesController')(app);
require('./patchesController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`No C-3PR BRAIN endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.port, () => {
    const logMeta = {nodeName: 'c3pr-brain', correlationIds: 'boot', moduleName: 'main'};

    c3prLOG(`C-3PR BRAIN is up at port ${config.c3pr.port}.`, logMeta);

    c3prLOG(`Now broadcasting to C-3PR registry.`, logMeta);
    setInterval(() => {
        axios.patch(config.c3pr.registryUrl, [
            {key: `changesUrl`, value: config.c3pr.changesUrl, timeout: 13 * 1000},
            {key: `patchesUrl`, value: config.c3pr.patchesUrl, timeout: 13 * 1000}
        ]);
    }, 10 * 1000);
});
