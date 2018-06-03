import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import handlePush from '../handlePush/handlePush';
import handleMergeRequest from '../handleMergeRequest/handleMergeRequest';


function logMetaz(correlationId?: string) {
    return [{nodeName: 'c3pr-repo-gitlab', correlationId: correlationId, moduleName: 'handleWebhook'}];
}

export default function handleWebhook(webhookPayload) {
    if (webhookPayload.object_kind === "push") {
        c3prLOG2({
            msg: `Received webhook for PUSH from ${webhookPayload.repository.git_http_url}. Message: '${webhookPayload.commits && webhookPayload.commits[0].message.trim()}'.`,
            logMetas: logMetaz(webhookPayload.after)
        });
        handlePush(webhookPayload);
    } else if (webhookPayload.object_kind === "merge_request") {
        handleMergeRequest(webhookPayload);
    } else {
        c3prLOG2({
            msg: `Received webhook. Unknown type: ${webhookPayload.object_kind}.`,
            logMetas: logMetaz(webhookPayload.after),
            meta: {webhookPayload},
        });
    }
}