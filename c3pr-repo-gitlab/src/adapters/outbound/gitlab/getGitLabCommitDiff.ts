import axios from 'axios';
import config from '../../../config';
import {OutboundPorts} from "../../../ports/outbound/OutboundPorts";
import {GitLabModifiedFile} from "../../../ports/outbound/types/GitLabModifiedFile";


async function getGitLabCommitDiff(urlEncodedOrgNameProjectName, sha: string): Promise<GitLabModifiedFile[]> {
    const {data: modifiedFiles} = await axios.get(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/repository/commits/${sha}/diff`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    return modifiedFiles;
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: OutboundPorts['getGitLabCommitDiff'] = getGitLabCommitDiff;

export { getGitLabCommitDiff }