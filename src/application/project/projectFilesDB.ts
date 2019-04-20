import * as assert from "assert";
const client = require('../../infrastructure/db');
const config = require('../../config');


interface LineInterval {
    start: number;
    end: number;
}
interface ProjectFile {
    project_uuid: string;
    file_path: string;
    analyses: [
        {tool_name: string, lines: LineInterval[], date_time: string}
    ],
    excluded_for_tools:
        ({all_tools: boolean, all_lines: boolean,    reason?: string} |
        {all_tools: boolean, lines: LineInterval[], reason?: string} |
        {tool_name: string,  all_lines: boolean,    reason?: string} |
        {tool_name: string,  lines: LineInterval[], reason?: string})[]
    ;
}

const projectFilesDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoProjectFilesCollection));

async function insert(data) {
    return (await projectFilesDB).insertOne(data);
}
async function findBy(query) {
    return (await projectFilesDB).find(query).toArray();
}
async function findOne(project_uuid, file_path) {
    return (await findBy({project_uuid, file_path}))[0];
}

function assertProjectFileProperties(projectFile: ProjectFile) {
    assert.ok(projectFile.project_uuid
        && projectFile.file_path
        && (projectFile.analyses && projectFile.analyses.every(a => !!a.tool_name && a.lines.every(l => !!l.start && !!l.end) && !!a.date_time))
        && (projectFile.excluded_for_tools && projectFile.excluded_for_tools.every(
            (eft:any) => (eft.all_tools !== undefined || !!eft.tool_name) && (!!eft.all_lines !== undefined || eft.lines.every(l => !!l.start && !!l.end)))
        ),
        `Missing required properties from ProjectFile: ${JSON.stringify(projectFile)}`);
}

async function createProjectFile(projectFile: ProjectFile) {
    assertProjectFileProperties(projectFile);
    return insert(projectFile);
}

async function updateProjectFile({ project_uuid, file_path, analyses, excluded_for_tools }: ProjectFile) {
    assertProjectFileProperties({ project_uuid, file_path, analyses, excluded_for_tools });
    return (await projectFilesDB).update(
        {project_uuid, file_path},
        {$set: {analyses, excluded_for_tools}}
    );
}

async function createOrUpdateProjectFile(projectFile: ProjectFile) {
    if (await findOne(projectFile.project_uuid, projectFile.file_path)) {
        return updateProjectFile(projectFile);
    } else {
        return createProjectFile(projectFile);
    }

}

export default { findOne, findBy, createOrUpdateProjectFile, updateProjectFile };