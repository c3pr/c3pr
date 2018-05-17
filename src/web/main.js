const c3prLOG = require("node-c3pr-logger");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const cors = require('cors');

const app = express();

app.use(express.static('frontend/dist'));

app.use(bodyParser.json());

app.use(cors());

require('./logsController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send(`No C3PR endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.port, () => {
    c3prLOG(`C-3PR dashboard is up at port ${config.c3pr.port}.`, {nodeName: 'c3pr', correlationIds: 'boot', moduleName: 'main'});
});
