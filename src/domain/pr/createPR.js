const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const shell = require('node-git-client').shell;

const createPullRequest = require("../github/createPullRequest");
const createForkIfNotExists = require("../github/createForkIfNotExists");


const STAGE_REPOS_FOLDER = process.env.STAGE_REPOS_FOLDER || '/tmp/';


async function createPR({mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitHubApiToken, gitUserName, gitUserEmail, prCommitMessage, prTitle, prBody, patchContent}) {
    const nodeName = 'c3pr-repo-github';
    const prefix = `[${mainRepoHash}] [createPR]`;

    const gitHubApiTokenReplacement = {regex: new RegExp(gitHubApiToken, "g"), replaceWith: "<GITHUB_API_TOKEN>"};

    const mainRepoCloneUrl = `https://${gitHubApiToken}:${gitHubApiToken}@github.com/${mainRepoOrgRepo}.git`;

    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${STAGE_REPOS_FOLDER}/${stagingFolderName}`);

    const data = await createForkIfNotExists(mainRepoOrgRepo);

    const forkRepoOrg = data.owner.login;
    const forkRepoCloneUrl = data.clone_url.replace(`https://github.com/`, `https://${gitHubApiToken}:${gitHubApiToken}@github.com/`);
    const forkRepoBranch = stagingFolderName;

    await shell(`git init ${stagingFolder}`, {nodeName, prefix});

    // create brand new orphan branch
    await shell(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {nodeName, prefix});
    // add main repo, fetch it and merge into recently created branch

    await shell(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {nodeName, prefix, replacements: [gitHubApiTokenReplacement]});
    await shell(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {nodeName, prefix});
    await shell(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {nodeName, prefix});

    // APPLY CHANGES
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${stagingFolder}/${patchFileName}`;

    // The base64 used here assume a specific format, a patch file generated (somewhere else) as:
    // git diff > 'myPatch.patch'
    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patchContent, 'base64').toString('hex'), 'hex');

    await shell(`git apply ${patchFileName}`, {cwd: stagingFolder}, {nodeName, prefix});
    fs.unlinkSync(patchFilePath);

    // ADD and COMMIT CHANGES
    await shell(`git add -A`, {cwd: stagingFolder}, {nodeName, prefix});
    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await shell(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' commit -m "${prCommitMessage.replace(/"/g, '\\"')}"`, {cwd: stagingFolder}, {nodeName, prefix});

    // add fork repo
    await shell(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {nodeName, prefix, replacements: [gitHubApiTokenReplacement]});
    // push changes
    await shell(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {nodeName, prefix});

    // CREATE PULL REQUEST VIA API
    await createPullRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoBranch, prTitle, prBody);

}


module.exports = createPR;