declare function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, lcid, euuid }: {
    createForkIfNotExists: any;
    addAuthenticationToCloneUrl: any;
    tokenReplacementForLogFunction: any;
    mainRepoOrgRepo: any;
    mainRepoBranch: any;
    mainRepoHash: any;
    gitUserName: any;
    gitUserEmail: any;
    prCommitMessage: any;
    patchContent: any;
    mainRepoCloneUrl: any;
    lcid: any;
    euuid: any;
}): Promise<{
    forkRepoOrg: any;
    forkRepoProject: any;
    forkRepoBranch: string;
}>;
export default forkAndApplyPatch;
