import excludedFilesDB from "../application/project/excludedFilesDB";

const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

const projectsDB = require('../application/project/projectsDB');
const prsDB = require('../application/project/prsDB');

function removeMongoIds(list) {
    return list.map(item => ({...item, _id: undefined}));
}

export = function (app) {

    app.use('/api/v1/projects', authExpressMiddleware);

    // PROJECTS ////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    // PRS ////////////////////////////////////////////////////////////////////////////////////////////////////////

    app.get('/api/v1/projects/:project_uuid/prs', function ({params: {project_uuid}}, response) {
        prsDB.findAllOfProject(project_uuid).then((prs) => {
            response.status(200).send(prs);
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

    // EXCLUDED FILES //////////////////////////////////////////////////////////////////////////////////////////////////

    app.get('/api/v1/projects/:project_uuid/excluded_files', async function ({params: {project_uuid}, query: {file_path}}, response) {
        if (!(await projectsDB.findBy({uuid: project_uuid})).length) {
            response.status(404).send(`Project ${project_uuid} not found.`);
            return;
        }
        excludedFilesDB.findBy((file_path && {project_uuid, file_path}) || {project_uuid}).then((excludedFiles) => {
            response.status(200).send(removeMongoIds(excludedFiles));
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });


};