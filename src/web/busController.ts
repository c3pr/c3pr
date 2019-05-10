import {c3prBusGetListeners} from "../application/bus/bus";

export = function (app) {

    app.get('/api/v1/bus/listeners', function (request, response) {
        response.send(c3prBusGetListeners());
    });

};