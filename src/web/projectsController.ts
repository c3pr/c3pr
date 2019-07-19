import projectFilesDB from "../application/project/projectFilesDB";
import projectsDB from '../application/project/projectsDB';

const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

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

    // PROJECT FILES //////////////////////////////////////////////////////////////////////////////////////////////////

    app.get('/api/v1/projects/:project_uuid/files*', async function ({params}, response) {
        const {project_uuid} = params;
        if (await projectsDB.projectDoesNotExist({uuid: project_uuid})) {
            response.status(404).send(`Project ${project_uuid} not found.`);
            return;
        }
        const optional_file_path = params[0] && params[0].replace(/^\/(files\/)?/, '');
        projectFilesDB.findBy((optional_file_path && {project_uuid, file_path: optional_file_path}) || {project_uuid}).then((projectFiles) => {
            const filesWithoutMongoIds = removeMongoIds(projectFiles);
            response.status(200).send((optional_file_path && filesWithoutMongoIds[0]) || filesWithoutMongoIds);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.patch('/api/v1/projects/:project_uuid/files/*', async function ({body, params}, response) {
        const {project_uuid} = params;
        if (await projectsDB.projectDoesNotExist({uuid: project_uuid})) {
            response.status(404).send(`Project ${project_uuid} not found.`);
            return;
        }
        const file_path = params[0];
        if (project_uuid !== body.project_uuid || file_path !== body.file_path) {
            response.status(400).send(`Body properties project_uuid and file_path don't match the URL.`);
            return;
        }
        projectFilesDB.updateProjectFile({...body, project_uuid, file_path}).then((x) => {
            const updated_files = x.result.nModified;
            if (updated_files) {
                response.status(200).send({updated_files: updated_files});
            } else {
                response.status(404).send({updated_files: 0, message: `No files were found or modified.`});
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.put('/api/v1/projects/:project_uuid/files/*', async function ({body, params}, response) {
        const {project_uuid} = params;
        if (await projectsDB.projectDoesNotExist({uuid: project_uuid})) {
            response.status(404).send(`Project ${project_uuid} not found.`);
            return;
        }
        const file_path = params[0];
        if (project_uuid !== body.project_uuid || file_path !== body.file_path) {
            response.status(400).send(`Body properties project_uuid and file_path don't match the URL.`);
            return;
        }
        projectFilesDB.createOrUpdateProjectFile({...body, project_uuid, file_path}).then((x) => {
            const updated_files = x.result.nModified;
            if (updated_files) {
                response.status(200).send({updated_files: updated_files, created_files: 0});
            } else {
                response.status(201).send({updated_files: 0, created_files: x.result.n});
            }
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });


};