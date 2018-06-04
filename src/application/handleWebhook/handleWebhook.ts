import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import handlePush from '../handlePush/handlePush';
import handleMergeRequest from '../handleMergeRequest/handleMergeRequest';
import {GitLabPush} from "../../ports/outbound/types/GitLabPush/GitLabPush";
import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";


function logMetaz(correlationId?: string) {
    return [{nodeName: 'c3pr-repo-gitlab', correlationId: correlationId, moduleName: 'handleWebhook'}];
}

function handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated): Promise<any> {
    if (webhookPayload.object_kind === "push") {
        let gitlabPush = webhookPayload as GitLabPush;
        c3prLOG2({
            msg: `Received webhook for PUSH from ${gitlabPush.repository.git_http_url}. Message: '${gitlabPush.commits && gitlabPush.commits[0].message.trim()}'.`,
            logMetas: logMetaz(gitlabPush.after)
        });
        return handlePush(gitlabPush);
    }

    if (webhookPayload.object_kind === "merge_request") {
        let gitLabMergeRequestUpdated = webhookPayload as GitLabMergeRequestUpdated;
        return handleMergeRequest(gitLabMergeRequestUpdated);
    }

    c3prLOG2({
        msg: `Received webhook. Unknown type: ${webhookPayload.object_kind}.`,
        logMetas: logMetaz((webhookPayload as GitLabPush).after),
        meta: {webhookPayload},
    });
}

export { handleWebhook };