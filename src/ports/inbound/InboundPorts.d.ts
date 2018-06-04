import {GitLabMergeRequestUpdated} from "../outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import {GitLabPush} from "../outbound/types/GitLabPush/GitLabPush";

export interface InboundPorts {
    handlePullRequestRequested(): Promise<any>;
    handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated): Promise<any>;
}