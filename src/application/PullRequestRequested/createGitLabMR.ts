import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import outboundPorts from "../../ports/outbound/index";



async function createGitLabMR({
                            mainRepoOrgRepo,
                            mainRepoBranch,
                            mainRepoHash,
                            gitLabUrl,
                            gitLabApiToken,
                            gitUserName,
                            gitUserEmail,
                            prCommitMessage,
                            pr_assignee,
                            prTitle,
                            prBody,
                            patchContent
                        }) {

    const logMeta = {nodeName: 'c3pr-repo-gitlab', correlationId: mainRepoHash, moduleName: 'createGitLabMR'};
    c3prLOG2({
        msg: `Initiating MR creation.`,
        meta: {mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitLabUrl, gitLabApiToken, gitUserName, gitUserEmail, prCommitMessage, prTitle, prBody, patchContent},
        logMetas: [logMeta]
    });

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
        prCommitMessage,
        patchContent,
        mainRepoCloneUrl,
        logMetas: [logMeta]
    });
    return outboundPorts.createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, prTitle, prBody, pr_assignee);
}

export { createGitLabMR };