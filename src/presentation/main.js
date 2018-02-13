const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5003;
const app = express();

app.use(bodyParser.json());

require('./c3prController')(app);

app.listen(PORT, () => {
    console.log(`c3pr-agent now listening at port ${PORT}.`);
});
