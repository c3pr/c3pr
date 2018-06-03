import {Ports} from "./types/Ports";
import {getGitLabCommitDiff} from "./adapters/getGitLabCommitDiff";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {getGitLabProject} from "./adapters/getGitLabProject";
import {getGitLabCommit} from "./adapters/getGitLabCommit";

const index: Ports = {
    getGitLabCommitDiff,
    fetchFirstProjectForCloneUrl,
    getGitLabProject,
    getGitLabCommit
};
export default index;