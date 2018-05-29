const projectsDB = require('../application/project/projectsDB');
const authExpressMiddleware = require("../application/auth/authExpressMiddleware");


module.exports = function (app) {

    app.use('/api/v1/projects', authExpressMiddleware);

    app.get('/api/v1/projects/', function ({params: {eventType, uuid}}, response) {
        projectsDB.findAll().then((projects) => {
            response.status(200).send(projects);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

};