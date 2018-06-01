const axios = require('axios').default;
const config = require('../../config');

const getGitLabProject = require('./getGitLabProject');

async function createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, prTitle, prBodyMarkdown) {

    let {id: mainRepoId} = await getGitLabProject(mainRepoOrgRepo);
    let forkRepoId = encodeURIComponent(forkRepoOrg+"/"+forkRepoProject);

    let {data: mergeRequestCreation} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${forkRepoId}/merge_requests`,
        {
            //"id": forkRepoId,               // integer/string yes	The ID or URL-encoded path of the project owned by the authenticated user
            "source_branch": forkRepoBranch,  // string	       yes	The source branch
            "target_branch": mainRepoBranch,  // string	       yes	The target branch
            "title": prTitle,                 // string	       yes	Title of MR
            //"assignee_id": "",              // integer       no	Assignee user ID
            "description": prBodyMarkdown,    // string	       no	Description of MR
            "target_project_id": mainRepoId,  // integer       no	The target project (numeric id)
            //"labels": "",                   // string	       no	Labels for MR as a comma-separated list
            //"milestone_id": "",             // integer       no	The ID of a milestone
            //"remove_source_branch": "",     // boolean       no	Flag indicating if a merge request should remove the source branch when merging
            "allow_maintainer_to_push": true, // boolean       no	Whether or not a maintainer of the target project can push to the source branch
        },
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );

    return mergeRequestCreation;
}

module.exports = createMergeRequest;