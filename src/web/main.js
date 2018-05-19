const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors());

require('./busController')(app);
require('./registryController')(app);
require('./eventsController')(app);
require('./loginController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`No C-3PR hub endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.hub.port, () => {
    c3prLOG(`C-3PR hub is up at port ${config.c3pr.hub.port}.`, {nodeName: 'c3pr-hub', correlationIds: 'boot', moduleName: 'main'});
});
