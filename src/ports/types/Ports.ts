import {GitLabModifiedFile} from "./GitLabModifiedFile";

export interface Ports {
    fetchModifiedFiles(urlEncodedOrgNameProjectName, commit): Promise<GitLabModifiedFile[]>;
    fetchProjectUuidForCloneUrl(clone_url_http: string): Promise<string>;
}