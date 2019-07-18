import axios from 'axios';
import config from '../../../config';

import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import {encodeGroupProjectPath} from "./encodeGroupProjectPath";
import {GitLabForkCreation} from "../../../ports/outbound/types/GitLabForkCreation/GitLabForkCreation";
import {getGitLabProject} from "./getGitLabProject";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleForkCreation(urlEncodedOrgNameProjectName, {lcid, sha, euuid}) {
    let {data} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/fork`,
        {namespace: config.c3pr.repoGitlab.gitlab.botUserName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    let createForkResponse: GitLabForkCreation = data;
    c3prLOG4(
        `Fork '${urlEncodedOrgNameProjectName}' scheduled.`,
        {lcid, sha, euuid, meta: {urlEncodedOrgNameProjectName, url: config.c3pr.repoGitlab.gitlab.url, namespace: config.c3pr.repoGitlab.gitlab.botUserName}}
    );
    return createForkResponse.id;
}

async function waitForForkCompletion(projectId, {lcid, sha, euuid}) {
    let wait = true;
    while (wait) {
        await timeout(100);
        let {import_status} = await getGitLabProject(projectId);
        wait = import_status !== 'finished';
    }
    c3prLOG4(`Fork ${projectId} creation completed.`, {lcid, sha, euuid, meta: {projectId}});
}

async function renameFork(projectId, newForkName, {lcid, sha, euuid}) {
    let {data} = await axios.put(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${projectId}`,
        {path: newForkName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    c3prLOG4(`Fork '${projectId}' renamed to '${newForkName}'.`, {lcid, sha, euuid, meta: {projectId, path: newForkName, url: config.c3pr.repoGitlab.gitlab.url}});
    /** @namespace data.http_url_to_repo */
    return data.http_url_to_repo;
}

function generateForkName(urlEncodedOrgNameProjectName) {
    return urlEncodedOrgNameProjectName.replace(/%2F/g, '__');
}

/**
 * Forks the given project under the gitlab bot user account.
 */
async function createForkIfNotExists(orgNameProjectName, c3prLOG5): Promise<{organization: string, forkName: string, cloneUrl: string}> {
    c3prLOG5 = c3prLOG5({caller_name: 'createForkIfNotExists'});
    let urlEncodedOrgNameProjectName = encodeGroupProjectPath(orgNameProjectName);

    const forkName = generateForkName(urlEncodedOrgNameProjectName);
    const forkId = encodeURIComponent(config.c3pr.repoGitlab.gitlab.botUserName + '/' + forkName);
    try {
        let projectData = await getGitLabProject(forkId);
        c3prLOG5(`Fork '${forkId}' already exists, returning.`, {meta: {forkId, orgNameProjectName}});

        /** @namespace projectData.http_url_to_repo */
        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl: config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(projectData.http_url_to_repo)
        };
    } catch (error) {
        c3prLOG5(`Fork '${forkId}' does not exist, will be created.`, {error, meta: {forkId, orgNameProjectName}});
    }

    try {
        let projectId = await scheduleForkCreation(urlEncodedOrgNameProjectName, {...c3prLOG5});
        await waitForForkCompletion(projectId, {...c3prLOG5});
        let cloneUrl = await renameFork(projectId, forkName, {...c3prLOG5});

        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl
        }
    } catch (error) {
        c3prLOG5(`Error while creating fork.`, {error, meta: {urlEncodedOrgNameProjectName, forkName}});
        throw error;
    }

}

export { createForkIfNotExists };