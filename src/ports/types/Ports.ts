import {GitLabModifiedFile} from "./GitLabModifiedFile";

export interface Ports {
    fetchModifiedFiles(urlEncodedOrgNameProjectName, commit): Promise<GitLabModifiedFile[]>;
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
}