const axios = require('axios');
const config = require('../../config');

const encodeGroupProjectPath = require('./encodeGroupProjectPath');
const getGitLabProject = require('./getGitLabProject');
const c3prLOG = require("node-c3pr-logger");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleForkCreation(urlEncodedOrgNameProjectName) {
    let {data: createForkResponse} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/fork`,
        {namespace: config.c3pr.repoGitlab.gitlab.botUserName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    console.log('Fork scheduled.');
    return createForkResponse.id;
}

async function waitForForkCompletion(projectId) {
    let wait = true;
    while (wait) {
        await timeout(100);
        let {import_status} = await getGitLabProject(projectId);
        wait = import_status !== 'finished';
    }
    console.log('Fork creation completed.');
}

async function renameFork(projectId, newForkName) {
    let {data} = await axios.put(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${projectId}`,
        {path: newForkName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    console.log('Fork renamed.');
    return data.http_url_to_repo;
}

function generateForkName(urlEncodedOrgNameProjectName) {
    return urlEncodedOrgNameProjectName.replace(/%2F/g, '__');
}
/**
 * Forks the given project under the gitlab bot user account.
 */
async function createForkIfNotExists(orgNameProjectName, logMetas) {
    const logMeta = {nodeName: 'c3pr-repo-gitlab', moduleName: 'createForkIfNotExists'};

    let urlEncodedOrgNameProjectName = encodeGroupProjectPath(orgNameProjectName);

    const forkName = generateForkName(urlEncodedOrgNameProjectName);
    const forkId = encodeURIComponent(config.c3pr.repoGitlab.gitlab.botUserName + '/' + forkName);
    try {
        let projectData = await getGitLabProject(forkId);
        c3prLOG(`Fork '${forkId}' already exists, returning.`, {orgNameProjectName}, logMetas, logMeta);
        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl: config.c3pr.gitlabUrlTransform(projectData.http_url_to_repo)
        };
    } catch (e) {
        c3prLOG(`Fork '${forkId}' does not exist, will be created.`, {orgNameProjectName}, logMetas, logMeta);
    }

    let projectId = await scheduleForkCreation(urlEncodedOrgNameProjectName);
    await waitForForkCompletion(projectId);
    let cloneUrl = await renameFork(projectId, forkName);

    return {
        organization: config.c3pr.repoGitlab.gitlab.botUserName,
        forkName,
        cloneUrl
    }

}

module.exports = createForkIfNotExists;