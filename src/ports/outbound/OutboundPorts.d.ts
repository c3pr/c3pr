import {GitLabModifiedFile} from "./types/GitLabModifiedFile";
import {GitLabProject} from "./types/GitLabProject/GitLabProject";
import {GitLabCommit} from "./types/GitLabCommit/GitLabCommit";
import {GitLabMergeRequestCreated} from "./types/GitLabMergeRequestCreated/GitLabMergeRequestCreated";

export interface OutboundPorts {
    getGitLabCommitDiff(urlEncodedOrgNameProjectName, sha: string): Promise<GitLabModifiedFile[]>;
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
    getGitLabProject(project_id: string | number): Promise<GitLabProject>;
    getGitLabCommit(project_id: string | number, sha: string): Promise<GitLabCommit>;

    forkAndApplyPatch({ createForkIfNotExists, addAuthenticationToCloneUrl, tokenReplacementForLogFunction, mainRepoOrgRepo, mainRepoBranch, mainRepoHash,
                          gitUserName, gitUserEmail, prCommitMessage, patchContent, mainRepoCloneUrl, lcid, euuid }: {
            createForkIfNotExists: any; addAuthenticationToCloneUrl: any; tokenReplacementForLogFunction: any; mainRepoOrgRepo: any; mainRepoBranch: any; mainRepoHash: any;
                gitUserName: any; gitUserEmail: any; prCommitMessage: any; patchContent: any; mainRepoCloneUrl: any; lcid: string; euuid: string
    }): Promise<{forkRepoOrg: any; forkRepoProject: any; forkRepoBranch: string;}>;

    createMergeRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, prTitle, prBodyMarkdown, pr_assignee, {lcid, euuid}): Promise<GitLabMergeRequestCreated>;
    createForkIfNotExists(orgNameProjectName, {lcid, euuid}): Promise<{organization: string, forkName: string, cloneUrl: string}>
}