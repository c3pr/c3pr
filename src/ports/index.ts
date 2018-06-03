import {Ports} from "./types/Ports";
import {fetchModifiedFiles} from "./adapters/fetchModifiedFiles";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {getGitLabProject} from "./adapters/getGitLabProject";
import {getGitLabCommit} from "./adapters/getGitLabCommit";

const index: Ports = {
    fetchModifiedFiles,
    fetchFirstProjectForCloneUrl,
    getGitLabProject,
    getGitLabCommit
};
export default index;