import axios from 'axios';
import config from '../../../config';
import {OutboundPorts} from "../../../ports/outbound/OutboundPorts";
import {GitLabProject} from "../../../ports/outbound/types/GitLabProject/GitLabProject";
import {encodeGroupProjectPath} from "./encodeGroupProjectPath";


async function getGitLabProject(project_id: string | number): Promise<GitLabProject> {
    let {data: getProject} = await axios.get(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${encodeGroupProjectPath(project_id)}`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    return getProject;
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: OutboundPorts['getGitLabProject'] = getGitLabProject;

export { getGitLabProject };