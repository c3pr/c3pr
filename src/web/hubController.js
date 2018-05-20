const axios = require('axios');
const config = require('../config');

module.exports = function (app) {

    app.get('/api/hub*', function (request, response) {
        const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
        axios.get(config.c3pr.hub.c3prHubUrl + request.params[0], {headers}).then(({data}) => {
            response.send(data);
        }).catch(e => {
            response.send(e.toString());
        })
    });

};