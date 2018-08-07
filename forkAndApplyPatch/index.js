"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const rimraf = require("rimraf");
const uuid_1 = require("uuid");
const c3prLOG4_1 = require("node-c3pr-logger/c3prLOG4");
const c3prSH3_1 = require("node-c3pr-git-client/src/c3prSH3");
const applyGitPatchBase64_1 = require("node-c3pr-git-client/patch/applyGitPatchBase64");
const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';
async function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, lcid, euuid }) {
    const stagingFolderName = `${mainRepoHash}_${uuid_1.v4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);
    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, { lcid, euuid });
    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = stagingFolderName;
    await c3prSH3_1.default(`git init ${stagingFolder}`, {}, { lcid, euuid });
    // create brand new orphan branch
    await c3prSH3_1.default(`git checkout --orphan ${forkRepoBranch}`, { cwd: stagingFolder }, { lcid, euuid });
    // add main repo, fetch it and merge into recently created branch
    await c3prSH3_1.default(`git remote add main ${mainRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], lcid, euuid });
    await c3prSH3_1.default(`git fetch main ${mainRepoBranch}`, { cwd: stagingFolder }, { lcid, euuid });
    await c3prSH3_1.default(`git merge main/${mainRepoBranch}`, { cwd: stagingFolder }, { lcid, euuid });
    await applyGitPatchBase64_1.default(stagingFolder, gitUserName, gitUserEmail, { hexBase64: patchContent, plain: '', header: '', footer: '' }, { lcid, euuid });
    // add fork repo
    await c3prSH3_1.default(`git remote add fork ${forkRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], lcid, euuid });
    // push changes
    await c3prSH3_1.default(`git push -u fork ${forkRepoBranch}`, { cwd: stagingFolder }, { lcid, euuid });
    rimraf(forkRepoBranch, () => {
        c3prLOG4_1.default(`Clone/staging folder ${forkRepoBranch} removed.`, { lcid, euuid });
    });
    return { forkRepoOrg, forkRepoProject, forkRepoBranch };
}
// noinspection JSUnusedGlobalSymbols
exports.default = forkAndApplyPatch;
//# sourceMappingURL=index.js.map