const assert = require('assert');
const client = require('../../infrastructure/db');
const config = require('../../config');

interface ExcludedFile {
    project_uuid: string;
    file_path: string;
    excluded_for_all_tools?: {is_excluded_for_all_tools: boolean, reason?: string};
    excluded_for_tools?: [{tool_name: string, reason?: string}];
}

const excludedFilesDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoExcludedFilesCollection));

async function insert(data) {
    return (await excludedFilesDB).insertOne(data);
}
async function findBy(query) {
    return (await excludedFilesDB).find(query).toArray();
}
async function findOne(project_uuid, file_path) {
    return (await excludedFilesDB).find({project_uuid, file_path}).toArray()[0];
}

function assertExcludedFileProperties(excludedFile: ExcludedFile) {
    assert.ok(excludedFile.project_uuid
        && excludedFile.file_path
        && (
            (excludedFile.excluded_for_all_tools && excludedFile.excluded_for_all_tools.is_excluded_for_all_tools)
            ||
            (excludedFile.excluded_for_tools && excludedFile.excluded_for_tools.every(eft => !!eft.tool_name))
        ),
        `Missing required properties from ExcludedFile: ${JSON.stringify(excludedFile)}`);
}

async function createExcludedFile(excludedFile: ExcludedFile) {
    assertExcludedFileProperties(excludedFile);
    return insert(excludedFile);
}

async function updateExcludedFile({ project_uuid, file_path, excluded_for_all_tools, excluded_for_tools }: ExcludedFile) {
    assertExcludedFileProperties({ project_uuid, file_path, excluded_for_all_tools, excluded_for_tools });
    return (await excludedFilesDB).update(
        {project_uuid, file_path},
        {$set: {excluded_for_all_tools, excluded_for_tools}}
    );
}

async function deleteExcludedFile({ project_uuid, file_path }: ExcludedFile) {
    assert.ok(project_uuid && file_path, 'Missing required arg for deleteExcludedFile()');
    return (await excludedFilesDB).delete({project_uuid, file_path});
}

export default { findOne, findBy, createExcludedFile, updateExcludedFile, deleteExcludedFile };