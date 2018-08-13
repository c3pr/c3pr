import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import outboundPorts from "../../ports/outbound/index";


async function createGitLabMR({
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
                            patchHexBase64,
                            lcid, sha, euuid
                        }) {

    c3prLOG4(
        `Initiating MR creation.`,
        {lcid, sha, euuid, meta: {mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitLabUrl, gitLabApiToken, gitUserName, gitUserEmail, pr_title, pr_body, pr_assignee, patchHexBase64}}
    );

    const addAuthenticationToCloneUrl = (cloneUrl) => {
        return cloneUrl.replace(/^http(s?):\/\//, `http$1://clone:${gitLabApiToken}@`)
    };

    const mainRepoCloneUrl = addAuthenticationToCloneUrl(`${gitLabUrl}/${mainRepoOrgRepo}.git`);

    const tokenReplacementForLogFunction = {regex: new RegExp(gitLabApiToken, "g"), replaceWith: "<GITLAB_API_TOKEN>"};

    let {forkRepoOrg, forkRepoProject, forkRepoBranch} = await outboundPorts.forkAndApplyPatch({
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
        mainRepoCloneUrl,
        lcid, sha, euuid
    });
    return outboundPorts.createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, pr_title, pr_body, pr_assignee, {lcid, sha, euuid});
}

export { createGitLabMR };