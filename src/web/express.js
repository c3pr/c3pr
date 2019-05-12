const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');

const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const app = express();

app.use(express.static('frontend/dist'));

app.use(bodyParser.json());

app.use(cors());

require('./hubController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send(`No C-3PR dashboard endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.dashboard.c3prDashboardPort, () => {
    c3prLOG5(`C-3PR dashboard is up at port ${config.c3pr.dashboard.c3prDashboardPort}.`, {sha: '!express-init-dashboard'});
});
