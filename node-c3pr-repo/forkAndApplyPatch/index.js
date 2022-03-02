"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const rimraf = require("rimraf");
const uuid_1 = require("uuid");
const c3prSH3_1 = require("node-c3pr-git-client/src/c3prSH3");
const applyGitPatchBase64_1 = require("node-c3pr-git-client/patch/applyGitPatchBase64");
const os = require("os");
const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';
let forkCount = 0;
async function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl }, c3prLOG5) {
    c3prLOG5 = c3prLOG5({ caller_name: 'forkAndApplyPatch' });
    const stagingFolderName = `${mainRepoHash}_${uuid_1.v4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);
    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, c3prLOG5);
    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = 'C3PR_' + mainRepoHash.substring(0, 8) + '_' + os.hostname().substring(0, 2) + (++forkCount % 36).toString(36) + Date.now().toString(36);
    await c3prSH3_1.default(`git init ${stagingFolder}`, {}, {}, c3prLOG5);
    // create brand new orphan branch
    await c3prSH3_1.default(`git checkout --orphan ${forkRepoBranch}`, { cwd: stagingFolder }, {}, c3prLOG5);
    // add main repo, fetch it and merge into recently created branch
    await c3prSH3_1.default(`git remote add main ${mainRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction] }, c3prLOG5);
    await c3prSH3_1.default(`git fetch main ${mainRepoBranch}`, { cwd: stagingFolder }, {}, c3prLOG5);
    await c3prSH3_1.default(`git merge main/${mainRepoBranch}`, { cwd: stagingFolder }, {}, c3prLOG5);
    await applyGitPatchBase64_1.default(stagingFolder, gitUserName, gitUserEmail, { hexBase64: patchContent, plain: '', header: '', footer: '' }, c3prLOG5);
    // add fork repo
    await c3prSH3_1.default(`git remote add fork ${forkRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction] }, c3prLOG5);
    // push changes
    await c3prSH3_1.default(`git push -u fork ${forkRepoBranch}`, { cwd: stagingFolder }, {}, c3prLOG5);
    rimraf(forkRepoBranch, () => {
        c3prLOG5(`Clone/staging folder ${forkRepoBranch} removed.`);
    });
    return { forkRepoOrg, forkRepoProject, forkRepoBranch };
}
exports.forkAndApplyPatch = forkAndApplyPatch;
//# sourceMappingURL=index.js.map