const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.static('resources/public'));

app.use(bodyParser.json());

require('./changesController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('No C3PR endpoint is listening at the requested location.');
});

app.listen(PORT);