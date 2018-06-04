import { handlePullRequestRequested } from '../../application/PullRequestRequested/handlePullRequestRequested';
import {GitLabMergeRequestUpdated} from "../outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import {GitLabPush} from "../outbound/types/GitLabPush/GitLabPush";
import {handleWebhook} from "../../application/handleWebhook/handleWebhook";


export interface InboundPorts {
    handlePullRequestRequested(): Promise<any>;
    handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated): Promise<any>;
}


const inboundPorts: InboundPorts = {
    handlePullRequestRequested,
    handleWebhook
};
export default inboundPorts;