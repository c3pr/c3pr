const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

const logsDB = require('../application/logs/logsDB');

module.exports = function (app) {

    app.use('/api/v1/logs', authExpressMiddleware);

    app.get('/api/v1/logs', function ({query}, response) {
        logsDB.findBy(query).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/logs/nodes', function ({query}, response) {
        logsDB.findNodes().then((nodes) => {
            response.status(200).send(nodes);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/logs/:node_name/', function ({params: {node_name}}, response) {
        logsDB.findBy({node: node_name}).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/logs/id/:correlation_id/', function ({params: {correlation_id}}, response) {
        logsDB.findBy({correlationIds: { $all: [correlation_id] } }).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

};