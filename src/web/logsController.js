const fetchLogs = require('../application/fetchLogs');

module.exports = function (app) {

    app.get('/api/logs', function (request, response) {
        fetchLogs().then(logs => response.send(logs));
    });

};