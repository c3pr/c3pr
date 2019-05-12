const express = require('express');
const bodyParser = require('body-parser');
import config from '../config';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

const app = express();

app.use(bodyParser.json());

require('./c3prHubListenerController')(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send(`No C-3PR BRAIN endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.brain.c3prBrainPort, () => {
    c3prLOG5(`C-3PR BRAIN is up at port ${config.c3pr.brain.c3prBrainPort}.`, {sha: '!express-brain'});
});
