import * as path from 'path';
import * as rimraf from 'rimraf';
import { v4 as uuidv4 } from 'uuid';
import c3prSH3 from "node-c3pr-git-client/src/c3prSH3";
import applyGitPatchBase64 from "node-c3pr-git-client/patch/applyGitPatchBase64";
import * as os from "os";

const C3PR_CLONES_FOLDER = process.env.C3PR_CLONES_FOLDER || '/tmp/';

interface ForkAndApplyPatchArgs {
    createForkIfNotExists: (mainRepoOrgRepo: string, c3prLOG5: any) => Promise<{organization: string, forkName: string, cloneUrl: string}>;
    addAuthenticationToCloneUrl;
    tokenReplacementForLogFunction;
    mainRepoOrgRepo: string;
    mainRepoBranch;
    mainRepoHash;
    gitUserName;
    gitUserEmail;
    prCommitMessage;
    patchContent;
    mainRepoCloneUrl;
}

let forkCount = 0;

export async function forkAndApplyPatch(
    {
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
        mainRepoCloneUrl
    }: ForkAndApplyPatchArgs,
    c3prLOG5
) {
    c3prLOG5 = c3prLOG5({caller_name: 'forkAndApplyPatch'});

    const stagingFolderName = `${mainRepoHash}_${uuidv4()}`;
    const stagingFolder = path.resolve(`${C3PR_CLONES_FOLDER}/${stagingFolderName}`);

    const forkInfo = await createForkIfNotExists(mainRepoOrgRepo, c3prLOG5);

    const forkRepoOrg = forkInfo.organization;
    const forkRepoProject = forkInfo.forkName;
    const forkRepoCloneUrl = addAuthenticationToCloneUrl(forkInfo.cloneUrl);
    const forkRepoBranch = 'C3PR_' + mainRepoHash.substring(0, 8) + '_' + os.hostname().substring(0, 2) + (++forkCount % 36).toString(36) + Date.now().toString(36);

    await c3prSH3(`git init ${stagingFolder}`, {}, {}, c3prLOG5);

    // create brand new orphan branch
    await c3prSH3(`git checkout --orphan ${forkRepoBranch}`, {cwd: stagingFolder}, {}, c3prLOG5);
    // add main repo, fetch it and merge into recently created branch

    await c3prSH3(`git remote add main ${mainRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction]}, c3prLOG5);
    await c3prSH3(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}, {}, c3prLOG5);
    await c3prSH3(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}, {}, c3prLOG5);

    await applyGitPatchBase64(stagingFolder, gitUserName, gitUserEmail, {hexBase64: patchContent, plain: '', header: '', footer: ''}, c3prLOG5);

    // add fork repo
    await c3prSH3(`git remote add fork ${forkRepoCloneUrl}`, {cwd: stagingFolder}, {replacements: [tokenReplacementForLogFunction]}, c3prLOG5);
    // push changes
    await c3prSH3(`git push -u fork ${forkRepoBranch}`, {cwd: stagingFolder}, {}, c3prLOG5);

    rimraf(forkRepoBranch, () => {
        c3prLOG5(`Clone/staging folder ${forkRepoBranch} removed.`);
    });

    return {forkRepoOrg, forkRepoProject, forkRepoBranch};
}
