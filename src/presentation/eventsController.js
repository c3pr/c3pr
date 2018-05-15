const events = require('../application/events/events');
const authExpressMiddleware = require("../application/auth/authExpressMiddleware");


module.exports = function (app) {

    app.use('/api/v1/events', authExpressMiddleware);

    // curl -sD - http://127.0.0.1:5000/api/v1/events/MY_TYPE/peek/unprocessed --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/:eventType/peek/unprocessed', function (request, response) {
        events.peekUnprocessed(request.params.eventType).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(204).send();
            }
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    // curl -sD - http://127.0.0.1:5000/api/v1/events/MY_TYPE/2231a335-c00e-4246-961b-c23ff8ba8b0f --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/:eventType/:uuid', function ({params: {eventType, uuid}}, response) {
        events.find(uuid).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(404).send();
            }
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    // curl -sD - http://127.0.0.1:5000/api/v1/events --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/', function ({params: {eventType, uuid}}, response) {
        events.findAll().then((evts) => {
            response.status(200).send(evts);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    // curl -sD - http://127.0.0.1:5000/api/v1/events/MY_TYPE --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/:eventType/', function ({params: {eventType, uuid}}, response) {
        events.findAllOfType(eventType).then((evts) => {
            response.status(200).send(evts);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    // curl -sD - -X POST http://127.0.0.1:5000/api/v1/events/MY_TYPE --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:5000/api/v1/login | tr -d '"')"
    app.post('/api/v1/events/:eventType/', function (request, response) {
        events.register(request.params.eventType, request.body).then((uuid) => {
            response.status(200).send(uuid);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    // curl --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" -X PATCH http://127.0.0.1:5000/api/registry
    app.patch('/api/v1/events/:eventType/:uuid/meta/processing', function ({params: {eventType, uuid}, decodedJwtToken}, response) {
        let processorUUID = decodedJwtToken.sub;
        events.patchAsProcessing(eventType, uuid, processorUUID).then(() => {
            response.status(200).send();
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    app.patch('/api/v1/events/:eventType/:uuid/meta/processed', function ({params: {eventType, uuid}, decodedJwtToken}, response) {
        let processorUUID = decodedJwtToken.sub;
        events.patchAsProcessed(eventType, uuid, processorUUID).then(() => {
            response.status(200).send();
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });


};