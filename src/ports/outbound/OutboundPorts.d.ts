import {GitLabModifiedFile} from "./types/GitLabModifiedFile";
import {GitLabProject} from "./types/GitLabProject/GitLabProject";
import {GitLabCommit} from "./types/GitLabCommit/GitLabCommit";

export interface OutboundPorts {
    getGitLabCommitDiff(urlEncodedOrgNameProjectName, sha: string): Promise<GitLabModifiedFile[]>;
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
    getGitLabProject(project_id: string | number): Promise<GitLabProject>;
    getGitLabCommit(project_id: string | number, sha: string): Promise<GitLabCommit>;
}