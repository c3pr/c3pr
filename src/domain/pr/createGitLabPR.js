const createMergeRequest = require("../gitlab/createMergeRequest");
const createForkIfNotExists = require("../gitlab/createForkIfNotExists");
const createPR = require("node-c3pr-repo/create-pr/create-pr");

async function createGitLabPR({
                            mainRepoOrgRepo,
                            mainRepoBranch,
                            mainRepoHash,
                            gitHubApiToken,
                            gitUserName,
                            gitUserEmail,
                            prCommitMessage,
                            prTitle,
                            prBody,
                            patchContent
                        }) {

    const mainRepoCloneUrl = `https://${gitHubApiToken}:${gitHubApiToken}@github.com/${mainRepoOrgRepo}.git`;

    const addAuthenticationToCloneUrl = (cloneUrl) => {
        return cloneUrl.replace(`https://github.com/`, `https://${gitHubApiToken}:${gitHubApiToken}@github.com/`)
    };

    const tokenReplacementForLogFunction = {regex: new RegExp(gitHubApiToken, "g"), replaceWith: "<GITHUB_API_TOKEN>"};

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
        mainRepoCloneUrl
    });
}

module.exports = createGitLabPR;