const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5002;
const app = express();

app.use(bodyParser.json());

require('./c3prController')(app);

app.listen(PORT);