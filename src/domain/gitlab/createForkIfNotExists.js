const axios = require('axios');
const config = require('../../config');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getProject(projectId) {
    let {data: getProject} = await axios.get(
        `${config.c3pr.gitLabUrl}/api/v4/projects/${projectId}`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.gitLabApiToken}}
    );
    return getProject;
}

async function scheduleForkCreation(urlEncodedOrgNameProjectName) {
    let {data: createForkResponse} = await axios.post(
        `${config.c3pr.gitLabUrl}/api/v4/projects/${urlEncodedOrgNameProjectName}/fork`,
        {namespace: config.c3pr.gitUserName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.gitLabApiToken}}
    );
    console.log('Fork scheduled.');
    return createForkResponse.id;
}

async function waitForForkCompletion(projectId) {
    let wait = true;
    while (wait) {
        await timeout(100);
        let {import_status} = await getProject(projectId);
        wait = import_status !== 'finished';
    }
    console.log('Fork creation completed.');
}

async function renameFork(projectId, newForkName) {
    let {data} = await axios.put(
        `${config.c3pr.gitLabUrl}/api/v4/projects/${projectId}`,
        {path: newForkName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.gitLabApiToken}}
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
async function createForkIfNotExists(orgNameProjectName) {

    let urlEncodedOrgNameProjectName = orgNameProjectName;
    if (!orgNameProjectName.includes('%')) {
        urlEncodedOrgNameProjectName = encodeURIComponent(orgNameProjectName);
    }

    const forkName = generateForkName(urlEncodedOrgNameProjectName);
    const forkId = encodeURIComponent(config.c3pr.gitUserName + '/' + forkName);
    try {
        let projectData = await getProject(forkId);
        console.log(`Fork '${forkId}' already exists, returning.`);
        return {
            organization: config.c3pr.gitUserName,
            forkName,
            cloneUrl: projectData.http_url_to_repo
        };
    } catch (e) {
        console.log(`Fork '${forkId}' does not exist, will be created.`);
    }

    let projectId = await scheduleForkCreation(urlEncodedOrgNameProjectName);
    await waitForForkCompletion(projectId);
    let cloneUrl = await renameFork(projectId, forkName);

    return {
        organization: config.c3pr.gitUserName,
        forkName,
        cloneUrl
    }

}

module.exports = createForkIfNotExists;