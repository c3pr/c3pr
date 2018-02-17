const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const shell = require('node-git-client').shell;

const createPullRequest = require("../github/createPullRequest");
const createForkIfNotExists = require("../github/createForkIfNotExists");


const STAGE_REPOS_FOLDER = process.env.STAGE_REPOS_FOLDER || '/tmp/';


async function createPR({mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, prTitle, prBody, patchContent}) {
    const prefix = `[${mainRepoHash}] [createPR]`;
    const mainRepoCloneUrl = 'https://github.com/' + mainRepoOrgRepo + '.git';

    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${STAGE_REPOS_FOLDER}/${stagingFolderName}`);

    const data = await createForkIfNotExists(mainRepoOrgRepo);

    const forkRepoOrg = data.owner.login;
    const forkRepoCloneUrl = data.clone_url;
    const forkRepoBranch = stagingFolderName;

    await shell(`git init ${stagingFolder}`, {prefix});

    // create brand new orphan branch
    await shell(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {prefix});
    // add main repo, fetch it and merge into recently created branch
    await shell(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {prefix});
    await shell(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {prefix});
    await shell(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {prefix});

    // APPLY CHANGES
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${stagingFolder}/${patchFileName}`;

    // The base64 used here assume a specific format, a patch file generated (somewhere else) as:
    // git diff > 'myPatch.patch'
    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patchContent, 'base64').toString('hex'), 'hex');

    await shell(`git apply ${patchFileName}`, {cwd: stagingFolder}, {prefix});
    fs.unlinkSync(patchFilePath);

    // ADD and COMMIT CHANGES
    await shell(`git add -A`, {cwd: stagingFolder}, {prefix});
    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await shell(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' commit -m "${prCommitMessage.replace(/"/g, '\\"')}"`, {cwd: stagingFolder}, {prefix});

    // add fork repo
    await shell(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {prefix});
    // push changes
    await shell(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {prefix});

    // CREATE PULL REQUEST VIA API
    await createPullRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoBranch, prTitle, prBody);

}


module.exports = createPR;