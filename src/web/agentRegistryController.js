const agentRegistry = require('../application/agentRegistry/agentRegistry');


module.exports = function (app) {

    app.get('/api/v1/agents', function (request, response) {
        agentRegistry.findAll().then(agents => {
            response.send(agents);
        })
    });

    app.patch('/api/v1/agents', function (request, response) {
        try {
            const agentOrArrayOfAgents = request.body;
            agentRegistry.putAgentsOrAgent({sub: 'anyone'}, agentOrArrayOfAgents);
            response.status(200).send('Agent successfully registered!');
        } catch (e) {
            response.status(400).send(e);
        }
    });

};