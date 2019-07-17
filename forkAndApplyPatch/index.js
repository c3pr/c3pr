"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const rimraf = require("rimraf");
const uuid_1 = require("uuid");
const c3prLOG4_1 = require("node-c3pr-logger/c3prLOG4");
const c3prSH3_1 = require("node-c3pr-git-client/src/c3prSH3");
const applyGitPatchBase64_1 = require("node-c3pr-git-client/patch/applyGitPatchBase64");
const os = require("os");
const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';
async function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, lcid, sha, euuid }) {
    const stagingFolderName = `${mainRepoHash}_${uuid_1.v4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);
    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, { lcid, sha, euuid });
    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = 'C3PR_' + mainRepoHash.substring(0, 8) + '_' + os.hostname().substring(0, 3) + Date.now().toString(16);
    await c3prSH3_1.default(`git init ${stagingFolder}`, {}, { lcid, sha, euuid });
    // create brand new orphan branch
    await c3prSH3_1.default(`git checkout --orphan ${forkRepoBranch}`, { cwd: stagingFolder }, { lcid, sha, euuid });
    // add main repo, fetch it and merge into recently created branch
    await c3prSH3_1.default(`git remote add main ${mainRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], lcid, sha, euuid });
    await c3prSH3_1.default(`git fetch main ${mainRepoBranch}`, { cwd: stagingFolder }, { lcid, sha, euuid });
    await c3prSH3_1.default(`git merge main/${mainRepoBranch}`, { cwd: stagingFolder }, { lcid, sha, euuid });
    await applyGitPatchBase64_1.default(stagingFolder, gitUserName, gitUserEmail, { hexBase64: patchContent, plain: '', header: '', footer: '' }, { lcid, sha, euuid });
    // add fork repo
    await c3prSH3_1.default(`git remote add fork ${forkRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], lcid, sha, euuid });
    // push changes
    await c3prSH3_1.default(`git push -u fork ${forkRepoBranch}`, { cwd: stagingFolder }, { lcid, sha, euuid });
    rimraf(forkRepoBranch, () => {
        c3prLOG4_1.default(`Clone/staging folder ${forkRepoBranch} removed.`, { lcid, sha, euuid });
    });
    return { forkRepoOrg, forkRepoProject, forkRepoBranch };
}
// noinspection JSUnusedGlobalSymbols
exports.default = forkAndApplyPatch;
//# sourceMappingURL=index.js.map