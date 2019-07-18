import outboundPorts from "../../ports/outbound/index";
import {forkAndApplyPatch} from "node-c3pr-repo/forkAndApplyPatch";
import {createMergeRequest} from "../../adapters/outbound/gitlab/createMergeRequest";

async function createGitLabMR(
    {
        mainRepoOrgRepo,
        mainRepoBranch,
        mainRepoHash,
        gitLabUrl,
        gitLabApiToken,
        gitUserName,
        gitUserEmail,
        pr_assignee,
        pr_title,
        pr_body,
        patchHexBase64
    },
    c3prLOG5
) {
    c3prLOG5 = c3prLOG5({caller_name: 'createGitLabMR'});
    c3prLOG5(`Initiating MR creation.`, {meta: {mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitLabUrl, gitLabApiToken, gitUserName, gitUserEmail, pr_title, pr_body, pr_assignee, patchHexBase64}});

    const addAuthenticationToCloneUrl = (cloneUrl) => {
        return cloneUrl.replace(/^http(s?):\/\//, `http$1://clone:${gitLabApiToken}@`)
    };

    const mainRepoCloneUrl = addAuthenticationToCloneUrl(`${gitLabUrl}/${mainRepoOrgRepo}.git`);

    const tokenReplacementForLogFunction = {regex: new RegExp(gitLabApiToken, "g"), replaceWith: "<GITLAB_API_TOKEN>"};

    let {forkRepoOrg, forkRepoProject, forkRepoBranch} = await forkAndApplyPatch(
        {
            createForkIfNotExists: outboundPorts.createForkIfNotExists,
            addAuthenticationToCloneUrl,
            tokenReplacementForLogFunction,
            mainRepoOrgRepo,
            mainRepoBranch,
            mainRepoHash,
            gitUserName,
            gitUserEmail,
            prCommitMessage: pr_title,
            patchContent: patchHexBase64,
            mainRepoCloneUrl
        },
        c3prLOG5
    );
    return createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, pr_title, pr_body, pr_assignee, c3prLOG5);
}

export { createGitLabMR };