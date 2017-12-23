const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// curl -X POST http://localhost:3000/ -H "Content-Type: application/json" --data '{"something":"stuff"}'
app.post('/', function(request, response){
    // print and echo back request
    console.log(request.body);
    response.send(request.body);
});

app.listen(3000);