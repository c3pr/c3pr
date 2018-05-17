const createMergeRequest = require("../gitlab/createMergeRequest");
const createForkIfNotExists = require("../gitlab/createForkIfNotExists");
const createPR = require("node-c3pr-repo/create-pr/create-pr");

const c3prLOG = require("node-c3pr-logger");

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

    await createPR({
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

module.exports = createGitLabMR;