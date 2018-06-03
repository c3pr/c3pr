import {GitLabModifiedFile} from "./GitLabModifiedFile";
import {GitLabProject} from "./GitLabProject/GitLabProject";
import {GitLabCommit} from "./GitLabCommit/GitLabCommit";

export interface Ports {
    fetchModifiedFiles(urlEncodedOrgNameProjectName, commit): Promise<GitLabModifiedFile[]>;
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
    getGitLabProject(project_id: string | number): Promise<GitLabProject>;
    getGitLabCommit(project_id: string | number, sha: string): Promise<GitLabCommit>;
}