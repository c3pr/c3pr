import axios from 'axios';
import config from '../../config';
import ports from "../../ports/outbound";

import encodeGroupProjectPath = require('./encodeGroupProjectPath');
import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleForkCreation(urlEncodedOrgNameProjectName, logMetas) {
    let {data: createForkResponse} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/fork`,
        {namespace: config.c3pr.repoGitlab.gitlab.botUserName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    c3prLOG2({
        msg: `Fork '${urlEncodedOrgNameProjectName}' scheduled.`,
        logMetas,
        meta: {urlEncodedOrgNameProjectName, url: config.c3pr.repoGitlab.gitlab.url, namespace: config.c3pr.repoGitlab.gitlab.botUserName}
    });
    return createForkResponse.id;
}

async function waitForForkCompletion(projectId, logMetas) {
    let wait = true;
    while (wait) {
        await timeout(100);
        let {import_status} = await ports.getGitLabProject(projectId);
        wait = import_status !== 'finished';
    }
    c3prLOG2({
        msg: `Fork ${projectId} creation completed.`,
        logMetas,
        meta: {projectId}
    });
}

async function renameFork(projectId, newForkName, logMetas) {
    let {data} = await axios.put(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${projectId}`,
        {path: newForkName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    c3prLOG2({
        msg: `Fork '${projectId}' renamed to '${newForkName}'.`,
        logMetas,
        meta: {projectId, path: newForkName, url: config.c3pr.repoGitlab.gitlab.url}
    });
    /** @namespace data.http_url_to_repo */
    return data.http_url_to_repo;
}

function generateForkName(urlEncodedOrgNameProjectName) {
    return urlEncodedOrgNameProjectName.replace(/%2F/g, '__');
}

/**
 * Forks the given project under the gitlab bot user account.
 */
async function createForkIfNotExists(orgNameProjectName, outerLogMetas = []) {
    const logMetas = [...outerLogMetas, {nodeName: 'c3pr-repo-gitlab', correlationId: orgNameProjectName, moduleName: 'createForkIfNotExists'}];

    let urlEncodedOrgNameProjectName = encodeGroupProjectPath(orgNameProjectName);

    const forkName = generateForkName(urlEncodedOrgNameProjectName);
    const forkId = encodeURIComponent(config.c3pr.repoGitlab.gitlab.botUserName + '/' + forkName);
    try {
        let projectData = await ports.getGitLabProject(forkId);
        c3prLOG2({
            msg: `Fork '${forkId}' already exists, returning.`,
            logMetas,
            meta: {forkId, orgNameProjectName}
        });
        /** @namespace projectData.http_url_to_repo */
        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl: config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(projectData.http_url_to_repo)
        };
    } catch (e) {
        c3prLOG2({
            msg: `Fork '${forkId}' does not exist, will be created.`,
            logMetas,
            meta: {forkId, orgNameProjectName}
        });
    }

    try {
        let projectId = await scheduleForkCreation(urlEncodedOrgNameProjectName, logMetas);
        await waitForForkCompletion(projectId, logMetas);
        let cloneUrl = await renameFork(projectId, forkName, logMetas);

        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl
        }
    } catch (e) {
        c3prLOG2({
            msg: `Error while creating fork. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}.`,
            logMetas,
            meta: {urlEncodedOrgNameProjectName, forkName, error: require('util').inspect(e)}
        });
        throw e;
    }

}

export { createForkIfNotExists };