declare function forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash, gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, logMetas }: {
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
    logMetas?: any[];
}): Promise<{
    forkRepoOrg: any;
    forkRepoProject: any;
    forkRepoBranch: string;
}>;
export default forkAndApplyPatch;
