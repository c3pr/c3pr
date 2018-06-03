import axios from 'axios';
import config from '../../config';

import encodeGroupProjectPath = require('../../application/gitlab/encodeGroupProjectPath');
import {GitLabProject} from "../types/GitLabProject/GitLabProject";

async function getGitLabProject(project_id: string | number): Promise<GitLabProject> {
    let {data: getProject} = await axios.get(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${encodeGroupProjectPath(project_id)}`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    return getProject;
}

export { getGitLabProject };