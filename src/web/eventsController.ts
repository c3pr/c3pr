const events = require('../application/events/events');
const authExpressMiddleware = require("../application/auth/authExpressMiddleware");


export = function (app) {

    app.use('/api/v1/events', authExpressMiddleware);

    // curl -sD - http://127.0.0.1:7300/api/v1/events/MY_TYPE/peek/unprocessed --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:7300/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/:eventType/peek/unprocessed', function (request, response) {
        events.peekUnprocessed(request.params.eventType).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(204).send();
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    // curl -sD - http://127.0.0.1:7300/api/v1/events/MY_TYPE/2231a335-c00e-4246-961b-c23ff8ba8b0f --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:7300/api/v1/login | tr -d '"')"
    // equally accepted path: '/api/v1/events/uuid/:uuid'
    app.get('/api/v1/events/:eventType/:uuid', function ({params: {eventType, uuid}}, response) {
        events.find(uuid).then((evt) => {
            if (evt) {
                response.status(200).send(evt);
            } else {
                response.status(404).send();
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/events/:eventType/analytics/count-per-project', function ({params: {eventType}}, response) {
        events.analyticsPerProjectEventCountOfType(eventType).then((aggregates) => {
            if (aggregates) {
                response.status(200).send(aggregates);
            } else {
                response.status(404).send();
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/events/', function ({query}, response) {
        events.findAll(query).then((evts) => {
            response.status(200).send(evts);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/events/broadcast', function ({query}, response) {
        events.broadcastUnprocessedEvents().then(() => {
            response.status(200).send('Broadcasted!');
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    // curl -sD - http://127.0.0.1:7300/api/v1/events/MY_TYPE --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:7300/api/v1/login | tr -d '"')"
    // curl -sD - http://127.0.0.1:7300/api/v1/events/ToolInvocationRequested?payload.parent.uuid=b5ae279d-2e5e-49d6-922c-fcc443e22204 --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:7300/api/v1/login | tr -d '"')"
    app.get('/api/v1/events/:eventType/', function ({params: {eventType}, query}, response) {
        events.findAllOfType(eventType, query).then((evts) => {
            response.status(200).send(evts);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    // curl -sD - -X POST http://127.0.0.1:7300/api/v1/events/MY_TYPE --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" --header "Authorization: Bearer $(curl -s -X POST http://127.0.0.1:7300/api/v1/login | tr -d '"')"
    app.post('/api/v1/events/:eventType/', function (request, response) {
        events.register(request.params.eventType, request.body).then((uuid) => {
            response.status(200).send(uuid);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.post('/api/v1/events/:eventType/reprocess-parents', function (request, response) {
        events.reprocessParents(request.params.eventType).then((uuid) => {
            response.status(200).send(uuid);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    // curl --data '{"key": "added", "value": "booo", "timeout": 10000}' --header "Content-Type: application/json" -X PATCH http://127.0.0.1:7300/api/registry
    app.patch('/api/v1/events/:eventType/:uuid/meta/processing', function ({params: {eventType, uuid}, decodeJwtToken}, response) {
        const jwtToken = decodeJwtToken(); if (!jwtToken) { response.status(401).send('Invalid token'); return; }
        let processor_uuid = jwtToken.sub;
        events.patchAsProcessing(eventType, uuid, processor_uuid).then(() => {
            response.status(200).send();
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.patch('/api/v1/events/:eventType/:uuid/meta/processed', function ({params: {eventType, uuid}, decodeJwtToken}, response) {
        const jwtToken = decodeJwtToken(); if (!jwtToken) { response.status(401).send('Invalid token'); return; }
        let processor_uuid = jwtToken.sub;
        events.patchAsProcessed(eventType, uuid, processor_uuid).then(() => {
            response.status(200).send();
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.patch('/api/v1/events/:eventType/:uuid/meta/unprocessed', function ({params: {eventType, uuid}, decodeJwtToken}, response) {
        const jwtToken = decodeJwtToken(); if (!jwtToken) { response.status(401).send('Invalid token'); return; }
        let processor_uuid = jwtToken.sub;
        events.patchAsUnprocessed(eventType, uuid, processor_uuid).then(() => {
            response.status(200).send();
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

};