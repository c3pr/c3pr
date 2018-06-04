import {OutboundPorts} from "./OutboundPorts";
import {getGitLabCommitDiff} from "../../adapters/outbound/gitlab/getGitLabCommitDiff";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {getGitLabProject} from "../../adapters/outbound/gitlab/getGitLabProject";
import {getGitLabCommit} from "../../adapters/outbound/gitlab/getGitLabCommit";
import forkAndApplyPatch from "node-c3pr-repo/forkAndApplyPatch";
import {createMergeRequest} from "../../adapters/outbound/gitlab/createMergeRequest";
import {createForkIfNotExists} from "../../adapters/outbound/gitlab/createForkIfNotExists";

const outboundPorts: OutboundPorts = {
    getGitLabCommitDiff,
    fetchFirstProjectForCloneUrl,
    getGitLabProject,
    getGitLabCommit,
    forkAndApplyPatch,
    createMergeRequest,
    createForkIfNotExists
};
export default outboundPorts;