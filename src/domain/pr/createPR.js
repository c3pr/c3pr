const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const c3prSH = require("node-git-client").c3prSH;

const createPullRequest = require("../github/createPullRequest");
const createForkIfNotExists = require("../github/createForkIfNotExists");


const STAGE_REPOS_FOLDER = process.env.STAGE_REPOS_FOLDER || '/tmp/';


async function createPR({mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitHubApiToken, gitUserName, gitUserEmail, prCommitMessage, prTitle, prBody, patchContent}) {
    const logMeta = {nodeName: 'c3pr-repo-github', correlationIds: mainRepoHash, moduleName: 'createPR'};

    const gitHubApiTokenReplacement = {regex: new RegExp(gitHubApiToken, "g"), replaceWith: "<GITHUB_API_TOKEN>"};

    const mainRepoCloneUrl = `https://${gitHubApiToken}:${gitHubApiToken}@github.com/${mainRepoOrgRepo}.git`;

    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${STAGE_REPOS_FOLDER}/${stagingFolderName}`);

    const data = await createForkIfNotExists(mainRepoOrgRepo);

    const forkRepoOrg = data.owner.login;
    const forkRepoCloneUrl = data.clone_url.replace(`https://github.com/`, `https://${gitHubApiToken}:${gitHubApiToken}@github.com/`);
    const forkRepoBranch = stagingFolderName;

    await c3prSH(`git init ${stagingFolder}`, {logMeta});

    // create brand new orphan branch
    await c3prSH(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {logMeta});
    // add main repo, fetch it and merge into recently created branch

    await c3prSH(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [gitHubApiTokenReplacement], logMeta});
    await c3prSH(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {logMeta});
    await c3prSH(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {logMeta});

    // APPLY CHANGES
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${stagingFolder}/${patchFileName}`;

    // The base64 used here assume a specific format, a patch file generated (somewhere else) as:
    // git diff > 'myPatch.patch'
    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patchContent, 'base64').toString('hex'), 'hex');

    await c3prSH(`git apply ${patchFileName}`, {cwd: stagingFolder}, {logMeta});
    fs.unlinkSync(patchFilePath);

    // ADD and COMMIT CHANGES
    await c3prSH(`git add -A`, {cwd: stagingFolder}, {logMeta});
    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await c3prSH(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' commit -m "${prCommitMessage.replace(/"/g, '\\"')}"`, {cwd: stagingFolder}, {logMeta});

    // add fork repo
    await c3prSH(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [gitHubApiTokenReplacement], logMeta});
    // push changes
    await c3prSH(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {logMeta});

    // CREATE PULL REQUEST VIA API
    await createPullRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoBranch, prTitle, prBody);

}


module.exports = createPR;