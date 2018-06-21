import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import c3prSH3 from "node-git-client/src/c3prSH3";
import { logMetasToIds } from "node-c3pr-logger/c3prLOG3";
import applyGitPatchBase64 from "node-git-client/patch/applyGitPatchBase64";

const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';

async function forkAndApplyPatch({
                            createForkIfNotExists,
                            addAuthenticationToCloneUrl,
                            tokenReplacementForLogFunction,
                            mainRepoOrgRepo,
                            mainRepoBranch,
                            mainRepoHash,
                            gitUserName,
                            gitUserEmail,
                            prCommitMessage,
                            patchContent,
                            mainRepoCloneUrl,
                            logMetas = []
                        }) {
    const logMeta = [...logMetas, {nodeName: 'node-c3pr-repo', correlationIds: mainRepoHash, moduleName: 'forkAndApplyPatch'}];
    const ids = logMetasToIds(logMeta);

    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);

    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, logMeta);

    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = stagingFolderName;

    await c3prSH3(`git init ${stagingFolder}`, {}, {ids});

    // create brand new orphan branch
    await c3prSH3(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {ids});
    // add main repo, fetch it and merge into recently created branch

    await c3prSH3(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction], ids});
    await c3prSH3(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {ids});
    await c3prSH3(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {ids});

    await applyGitPatchBase64(stagingFolder, gitUserName, gitUserEmail, {hexBase64: patchContent, plain: '', header: '', footer: ''}, {ids: [mainRepoHash]});

    // add fork repo
    await c3prSH3(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction], ids});
    // push changes
    await c3prSH3(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {ids});

    return {forkRepoOrg, forkRepoProject, forkRepoBranch};
}

// noinspection JSUnusedGlobalSymbols
export default forkAndApplyPatch;