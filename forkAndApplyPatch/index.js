"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const uuid_1 = require("uuid");
const c3prSH3_1 = require("node-git-client/src/c3prSH3");
const c3prLOG3_1 = require("node-c3pr-logger/c3prLOG3");
const applyGitPatchBase64_1 = require("node-git-client/patch/applyGitPatchBase64");
const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';
async function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, logMetas = [] }) {
    const logMeta = [...logMetas, { nodeName: 'node-c3pr-repo', correlationIds: mainRepoHash, moduleName: 'forkAndApplyPatch' }];
    const ids = c3prLOG3_1.logMetasToIds(logMeta);
    const stagingFolderName = `${mainRepoHash}_${uuid_1.v4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);
    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, logMeta);
    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = stagingFolderName;
    await c3prSH3_1.default(`git init ${stagingFolder}`, {}, { ids });
    // create brand new orphan branch
    await c3prSH3_1.default(`git checkout --orphan ${forkRepoBranch}`, { cwd: stagingFolder }, { ids });
    // add main repo, fetch it and merge into recently created branch
    await c3prSH3_1.default(`git remote add main ${mainRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], ids });
    await c3prSH3_1.default(`git fetch main ${mainRepoBranch}`, { cwd: stagingFolder }, { ids });
    await c3prSH3_1.default(`git merge main/${mainRepoBranch}`, { cwd: stagingFolder }, { ids });
    await applyGitPatchBase64_1.default(stagingFolder, gitUserName, gitUserEmail, { hexBase64: patchContent, plain: '', header: '', footer: '' }, { ids: [mainRepoHash] });
    // add fork repo
    await c3prSH3_1.default(`git remote add fork ${forkRepoCloneUrl}`, { cwd: stagingFolder }, { replacements: [tokenReplacementForLogFunction], ids });
    // push changes
    await c3prSH3_1.default(`git push -u fork ${forkRepoBranch}`, { cwd: stagingFolder }, { ids });
    return { forkRepoOrg, forkRepoProject, forkRepoBranch };
}
// noinspection JSUnusedGlobalSymbols
exports.default = forkAndApplyPatch;
//# sourceMappingURL=index.js.map