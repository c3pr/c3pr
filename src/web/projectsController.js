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

    app.patch('/api/v1/projects/:uuid', function ({body, params: {uuid}}, response) {
        projectsDB.updateProject({...body, uuid}).then((project) => {
            response.status(200).send(project);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/projects/:project_uuid/prs', function ({params: {project_uuid}}, response) {
        prsDB.findAllOfProject(project_uuid).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/projects/:project_uuid/blacklisted_files', function ({params: {project_uuid}}, response) {
        projectsDB.findBy({uuid: project_uuid}).then((projects) => {
            if (projects.length < 1) {
                response.status(404).send(`No project matches uuid ${project_uuid}.`);
            } else {
                response.status(200).send(projects[0].blacklisted_files || []);
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/projects/:project_uuid/prs/open/changed_files', function ({params: {project_uuid}}, response) {
        prsDB.findFilesWithOpenPR(project_uuid).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.post('/api/v1/projects/:project_uuid/prs', function ({body, params: {project_uuid}}, response) {
        prsDB.newPR({...body, project_uuid}).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.patch('/api/v1/projects/:project_uuid/prs/:pr_id', function ({body, params: {project_uuid, pr_id}}, response) {
        prsDB.updatePR({...body, project_uuid, pr_id}).then((prs) => {
            response.status(200).send(prs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

};