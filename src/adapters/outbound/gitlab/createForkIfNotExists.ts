import axios from 'axios';
import config from '../../../config';

import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import {encodeGroupProjectPath} from "./encodeGroupProjectPath";
import {GitLabForkCreation} from "../../../ports/outbound/types/GitLabForkCreation/GitLabForkCreation";
import {getGitLabProject} from "./getGitLabProject";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleForkCreation(urlEncodedOrgNameProjectName, {lcid, euuid}) {
    let {data} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/fork`,
        {namespace: config.c3pr.repoGitlab.gitlab.botUserName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    let createForkResponse: GitLabForkCreation = data;
    c3prLOG4(
        `Fork '${urlEncodedOrgNameProjectName}' scheduled.`,
        {lcid, euuid, meta: {urlEncodedOrgNameProjectName, url: config.c3pr.repoGitlab.gitlab.url, namespace: config.c3pr.repoGitlab.gitlab.botUserName}}
    );
    return createForkResponse.id;
}

async function waitForForkCompletion(projectId, {lcid, euuid}) {
    let wait = true;
    while (wait) {
        await timeout(100);
        let {import_status} = await getGitLabProject(projectId);
        wait = import_status !== 'finished';
    }
    c3prLOG4(`Fork ${projectId} creation completed.`, {lcid, euuid, meta: {projectId}});
}

async function renameFork(projectId, newForkName, {lcid, euuid}) {
    let {data} = await axios.put(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${projectId}`,
        {path: newForkName},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    c3prLOG4(`Fork '${projectId}' renamed to '${newForkName}'.`, {lcid, euuid, meta: {projectId, path: newForkName, url: config.c3pr.repoGitlab.gitlab.url}});
    /** @namespace data.http_url_to_repo */
    return data.http_url_to_repo;
}

function generateForkName(urlEncodedOrgNameProjectName) {
    return urlEncodedOrgNameProjectName.replace(/%2F/g, '__');
}

/**
 * Forks the given project under the gitlab bot user account.
 */
async function createForkIfNotExists(orgNameProjectName, {lcid, euuid}): Promise<{organization: string, forkName: string, cloneUrl: string}> {
    let urlEncodedOrgNameProjectName = encodeGroupProjectPath(orgNameProjectName);

    const forkName = generateForkName(urlEncodedOrgNameProjectName);
    const forkId = encodeURIComponent(config.c3pr.repoGitlab.gitlab.botUserName + '/' + forkName);
    try {
        let projectData = await getGitLabProject(forkId);
        c3prLOG4(`Fork '${forkId}' already exists, returning.`,{lcid, euuid, meta: {forkId, orgNameProjectName}});

        /** @namespace projectData.http_url_to_repo */
        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl: config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(projectData.http_url_to_repo)
        };
    } catch (error) {
        c3prLOG4(`Fork '${forkId}' does not exist, will be created.`, {lcid, euuid, error, meta: {forkId, orgNameProjectName}});
    }

    try {
        let projectId = await scheduleForkCreation(urlEncodedOrgNameProjectName, {lcid, euuid});
        await waitForForkCompletion(projectId, {lcid, euuid});
        let cloneUrl = await renameFork(projectId, forkName, {lcid, euuid});

        return {
            organization: config.c3pr.repoGitlab.gitlab.botUserName,
            forkName,
            cloneUrl
        }
    } catch (error) {
        c3prLOG4(`Error while creating fork.`, {lcid, euuid, error, meta: {urlEncodedOrgNameProjectName, forkName}});
        throw error;
    }

}

export { createForkIfNotExists };