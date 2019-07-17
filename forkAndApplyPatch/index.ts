import * as path from 'path';
import * as rimraf from 'rimraf';
import { v4 as uuidv4 } from 'uuid';
import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import c3prSH3 from "node-c3pr-git-client/src/c3prSH3";
import applyGitPatchBase64 from "node-c3pr-git-client/patch/applyGitPatchBase64";
import * as os from "os";

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
                            lcid, sha, euuid
                        }) {
    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);

    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, {lcid, sha, euuid});

    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = 'C3PR_' + mainRepoHash.substring(0, 8) + '_' + os.hostname().substring(0, 3) + Date.now().toString(16);

    await c3prSH3(`git init ${stagingFolder}`, {}, {lcid, sha, euuid});

    // create brand new orphan branch
    await c3prSH3(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {lcid, sha, euuid});
    // add main repo, fetch it and merge into recently created branch

    await c3prSH3(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction], lcid, sha, euuid});
    await c3prSH3(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {lcid, sha, euuid});
    await c3prSH3(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {lcid, sha, euuid});

    await applyGitPatchBase64(stagingFolder, gitUserName, gitUserEmail, {hexBase64: patchContent, plain: '', header: '', footer: ''}, {lcid, sha, euuid});

    // add fork repo
    await c3prSH3(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction], lcid, sha, euuid});
    // push changes
    await c3prSH3(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {lcid, sha, euuid});

    rimraf(forkRepoBranch, () => {
        c3prLOG4(`Clone/staging folder ${forkRepoBranch} removed.`, {lcid, sha, euuid});
    });

    return {forkRepoOrg, forkRepoProject, forkRepoBranch};
}

// noinspection JSUnusedGlobalSymbols
export default forkAndApplyPatch;