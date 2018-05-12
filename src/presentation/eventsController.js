const events = require('../domain/events/events');


module.exports = function (app) {

    app.get('/api/v1/events/:eventType/peek/unprocessed', function (request, response) {
        events.peekUnprocessed(request.params.eventType).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(404).send();
            }
        }).catch((e) => {
            response.status(500).send(e);
        });
    });

    // curl -s http://127.0.0.1:5000/api/v1/events/bozoType/2231a335-c00e-4246-961b-c23ff8ba8b0f
    // curl -I http://127.0.0.1:5000/api/v1/events/bozoType/2231a335-c00e-4246-961b-c23ff8ba8b0f
    app.get('/api/v1/events/:eventType/:uuid', function ({params: {eventType, uuid}}, response) {
        events.find(uuid).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(404).send();
            }
        }).catch((e) => {
            response.status(500).send(e);
        });
    });

    app.post('/api/v1/events/:eventType/', function (request, response) {
        events.register(request.params.eventType, request.body).then((uuid) => {
            response.status(200).send(uuid);
        }).catch((e) => {
            response.status(500).send(e);
        });
    });

    // curl --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" -X PATCH http://127.0.0.1:5000/api/registry
    app.patch('/api/v1/events/:eventType/:uuid/meta', function ({params: {eventType, uuid}}, response) {
        events.patchAsProcessing(eventType, uuid).then(() => {
            response.status(200).send();
        }).catch((e) => {
            response.status(500).send(e);
        });
    });

    app.patch('/api/v1/events/:eventType/:uuid/processed', function ({params: {eventType, uuid}}, response) {
        events.patchAsProcessed(eventType, uuid).then(() => {
            response.status(200).send();
        }).catch((e) => {
            response.status(500).send(e);
        });
    });


};