const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

const app = express();

app.use(express.static('resources/public'));

app.use(bodyParser.json());

require('./changesController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('No C3PR endpoint is listening at the requested location.');
});

console.log(`App listening at port ${config.c3pr.port}`);
app.listen(config.c3pr.port);
