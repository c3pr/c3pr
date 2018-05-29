const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

const projectsDB = require('../application/project/projectsDB');
const prsDB = require('../application/project/prsDB');

module.exports = function (app) {

    app.use('/api/v1/projects', authExpressMiddleware);

    app.get('/api/v1/projects/', function ({query}, response) {
        projectsDB.findBy(query).then((projects) => {
            response.status(200).send(projects);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    app.get('/api/v1/projects/:projectUUID/prs', function ({params: {projectUUID}}, response) {
        prsDB.findAllOfProject(projectUUID).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

    app.get('/api/v1/projects/:projectUUID/prs/open/changed_files', function ({params: {projectUUID}}, response) {
        prsDB.findFilesWithOpenPR(projectUUID).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
        });
    });

};