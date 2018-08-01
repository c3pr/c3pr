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

    app.get('/api/v1/logs/lcid/:lcid/', function ({params: {lcid}}, response) {
        logsDB.findBy({lcid}).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/logs/euuid/:euuid/', function ({params: {euuid}}, response) {
        logsDB.findBy({euuid}).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

};