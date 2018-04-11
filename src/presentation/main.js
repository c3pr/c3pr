const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5003;
const app = express();

app.use(bodyParser.json());

require('./c3prController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('This is the C3PR Agent, I am fine, thanks. Btw, no endpoint is listening at the requested location.');
});


app.listen(PORT, () => {
    console.log(`c3pr-agent now listening at port ${PORT}.`);
});
