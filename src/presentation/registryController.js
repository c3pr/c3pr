const c3prRegistry = require('../domain/c3prRegistry');


module.exports = function (app) {

    app.get('/api/registry', function (request, response) {
        response.send(c3prRegistry.registry);
    });

    app.get('/api/registry/debug', function (request, response) {
        response.send(c3prRegistry.debug);
    });

    // curl --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" -X PATCH http://127.0.0.1:5000/api/registry
    app.patch('/api/registry', function (request, response) {
        try {
            const entry = request.body;
            c3prRegistry.addEntry(entry);
            response.status(200).send('Got it!');
        } catch (e) {
            response.status(400).send('Error '+e);
        }
    });

};