import axios from 'axios';
import config from '../../config';
import {GitLabCommit} from "../types/GitLabCommit/GitLabCommit";
import {Ports} from "../types/Ports";
import encodeGroupProjectPath = require('../../application/gitlab/encodeGroupProjectPath');


async function getGitLabCommit(project_id: string | number, sha: string): Promise<GitLabCommit> {
    let {data: commit} = await axios.get(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${encodeGroupProjectPath(project_id)}/repository/commits/${sha}`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    return commit;
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: Ports['getGitLabCommit'] = getGitLabCommit;

export { getGitLabCommit };