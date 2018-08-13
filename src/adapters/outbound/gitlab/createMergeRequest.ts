import axios from 'axios';
import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

import config from '../../../config';
import {GitLabMergeRequestCreated} from "../../../ports/outbound/types/GitLabMergeRequestCreated/GitLabMergeRequestCreated";
import {getGitLabProject} from "./getGitLabProject";


async function createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, prTitle, prBodyMarkdown, pr_assignee, {lcid, sha, euuid}): Promise<GitLabMergeRequestCreated> {

    let {id: mainRepoId} = await getGitLabProject(mainRepoOrgRepo);
    let forkRepoId = encodeURIComponent(forkRepoOrg+"/"+forkRepoProject);

    const payload = {
        //"id": forkRepoId,               // integer/string yes	The ID or URL-encoded path of the project owned by the authenticated user
        "source_branch": forkRepoBranch,  // string	       yes	The source branch
        "target_branch": mainRepoBranch,  // string	       yes	The target branch
        "title": prTitle,                 // string	       yes	Title of MR
        "assignee_id": pr_assignee.id,    // integer       no	Assignee user ID
        "description": prBodyMarkdown,    // string	       no	Description of MR
        "target_project_id": mainRepoId,  // integer       no	The target project (numeric id)
        //"labels": "",                   // string	       no	Labels for MR as a comma-separated list
        //"milestone_id": "",             // integer       no	The ID of a milestone
        //"remove_source_branch": "",     // boolean       no	Flag indicating if a merge request should remove the source branch when merging
        "allow_maintainer_to_push": true, // boolean       no	Whether or not a maintainer of the target project can push to the source branch
    };

    c3prLOG4(`Requesting MR creation.`, {lcid, sha, euuid, meta: {mainRepoOrgRepo, forkRepoOrg, forkRepoProject, pr_assignee, payload}});

    let {data: mergeRequestCreation} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${forkRepoId}/merge_requests`,
        payload,
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );

    return mergeRequestCreation;
}

export { createMergeRequest };