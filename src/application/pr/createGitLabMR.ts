import createMergeRequest = require("../gitlab/createMergeRequest");
import createForkIfNotExists = require("../gitlab/createForkIfNotExists");
import createPR = require("node-c3pr-repo/create-pr/create-pr");

import c3prLOG = require("node-c3pr-logger");

async function createGitLabMR({
                            mainRepoOrgRepo,
                            mainRepoBranch,
                            mainRepoHash,
                            gitLabUrl,
                            gitLabApiToken,
                            gitUserName,
                            gitUserEmail,
                            prCommitMessage,
                            prTitle,
                            prBody,
                            patchContent
                        }) {

    const logMeta = {nodeName: 'c3pr-repo-gitlab', correlationId: mainRepoHash, moduleName: 'createGitLabMR'};
    c3prLOG(
        `Initiating MR creation.`,
        {mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitLabUrl, gitLabApiToken, gitUserName, gitUserEmail, prCommitMessage, prTitle, prBody, patchContent},
        logMeta
    );

    const addAuthenticationToCloneUrl = (cloneUrl) => {
        return cloneUrl.replace(/^http(s?):\/\//, `http$1://clone:${gitLabApiToken}@`)
    };

    const mainRepoCloneUrl = addAuthenticationToCloneUrl(`${gitLabUrl}/${mainRepoOrgRepo}.git`);

    const tokenReplacementForLogFunction = {regex: new RegExp(gitLabApiToken, "g"), replaceWith: "<GITLAB_API_TOKEN>"};

    return await createPR({
        createPullRequest: createMergeRequest,
        createForkIfNotExists,
        addAuthenticationToCloneUrl,
        tokenReplacementForLogFunction,
        mainRepoOrgRepo,
        mainRepoBranch,
        mainRepoHash,
        gitUserName,
        gitUserEmail,
        prCommitMessage,
        prTitle,
        prBody,
        patchContent,
        mainRepoCloneUrl,
        logMetas: [logMeta]
    });
}

export = createGitLabMR;