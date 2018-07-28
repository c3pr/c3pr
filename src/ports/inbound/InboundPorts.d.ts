import {GitLabMergeRequestUpdated} from "../outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import {GitLabPush} from "../outbound/types/GitLabPush/GitLabPush";

export interface InboundPorts {
    c3prRepoGitLabLogin(): Promise<void>;
    handlePullRequestRequested(): Promise<any>;
    handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated): Promise<any>;
}