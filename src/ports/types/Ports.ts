import {GitLabModifiedFile} from "./GitLabModifiedFile";
import {GitLabProject} from "./GitLabProject/GitLabProject";

export interface Ports {
    fetchModifiedFiles(urlEncodedOrgNameProjectName, commit): Promise<GitLabModifiedFile[]>;
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
    getGitLabProject(project_id: string | number): Promise<GitLabProject>;
}