import axios from "axios";
import config from "../../config";
import {GitLabModifiedFile} from "../types/GitLabModifiedFile";
import {Ports} from "../types/Ports";


async function fetchModifiedFiles(urlEncodedOrgNameProjectName, commit): Promise<GitLabModifiedFile[]> {
    const {data: modifiedFiles} = await axios.get(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/repository/commits/${commit.id}/diff`,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );
    return modifiedFiles;
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: Ports['fetchModifiedFiles'] = fetchModifiedFiles;

export { fetchModifiedFiles }