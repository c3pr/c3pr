const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

const projectsDB = require('../application/project/projectsDB');
const prsDB = require('../application/project/prsDB');

module.exports = function (app) {

    app.use('/api/v1/projects', authExpressMiddleware);

    app.get('/api/v1/projects/', function ({query}, response) {
        projectsDB.findBy(query).then((projects) => {
            response.status(200).send(projects);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/projects/:processor_uuid/prs', function ({params: {processor_uuid}}, response) {
        prsDB.findAllOfProject(processor_uuid).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/projects/:processor_uuid/prs/open/changed_files', function ({params: {processor_uuid}}, response) {
        prsDB.findFilesWithOpenPR(processor_uuid).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.post('/api/v1/projects/:processor_uuid/prs', function ({body, params: {processor_uuid}}, response) {
        // noinspection JSCheckFunctionSignatures
        prsDB.newPR({...body, processor_uuid}).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

};