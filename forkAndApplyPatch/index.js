"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const c3prSH = require("node-git-client").c3prSH;
const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';
async function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, logMetas = [] }) {
    const logMeta = [...logMetas, { nodeName: 'node-c3pr-repo', correlationIds: mainRepoHash, moduleName: 'forkAndApplyPatch' }];
    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);
    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, logMeta);
    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = stagingFolderName;
    await c3prSH(`git init ${stagingFolder}`, {}, { logMeta });
    // create brand new orphan branch
    await c3prSH(`git checkout --orphan ${forkRepoBranch}`, { cwd: stagingFolder }, { logMeta });
    // add main repo, fetch it and merge into recently created branch
    await c3prSH(`git remote add main ${mainRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], logMeta });
    await c3prSH(`git fetch main ${mainRepoBranch}`, { cwd: stagingFolder }, { logMeta });
    await c3prSH(`git merge main/${mainRepoBranch}`, { cwd: stagingFolder }, { logMeta });
    // APPLY CHANGES
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${stagingFolder}/${patchFileName}`;
    // The base64 used here assume a specific format, a patch file generated (somewhere else) as:
    // git diff > 'myPatch.patch'
    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patchContent, 'base64').toString('hex'), 'hex');
    await c3prSH(`git apply ${patchFileName}`, { cwd: stagingFolder }, { logMeta });
    fs.unlinkSync(patchFilePath);
    // ADD and COMMIT CHANGES
    await c3prSH(`git add -A`, { cwd: stagingFolder }, { logMeta });
    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await c3prSH(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' commit -m "${prCommitMessage.replace(/"/g, '\\"')}"`, { cwd: stagingFolder }, { logMeta });
    // add fork repo
    await c3prSH(`git remote add fork ${forkRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], logMeta });
    // push changes
    await c3prSH(`git push -u fork ${forkRepoBranch}`, { cwd: stagingFolder }, { logMeta });
    return { forkRepoOrg, forkRepoProject, forkRepoBranch };
}
// noinspection JSUnusedGlobalSymbols
exports.default = forkAndApplyPatch;
//# sourceMappingURL=index.js.map