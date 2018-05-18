const getListeners = require('../application/bus/bus').c3prBus.getListeners;


module.exports = function (app) {

    app.get('/api/v1/bus/listeners', function (request, response) {
        response.send(getListeners());
    });

};