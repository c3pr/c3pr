const fetchLogs = require('../application/fetchLogs');

module.exports = function (app) {

    app.get('/api/v1/logs', function (request, response) {
        fetchLogs().then(logs => response.send(logs));
    });

};