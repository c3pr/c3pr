const express = require('express');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static('resources/public'));

require('pushReceivedController')(app);

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.send('No C3PR endpoint is listening at the requested location.', 404);
});

app.listen(PORT);
