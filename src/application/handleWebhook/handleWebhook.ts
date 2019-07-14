import __c3prLOG5 from "node-c3pr-logger/c3prLOG5";
const _c3prLOG5 = __c3prLOG5({caller_name: 'handleWebhook'});

import handlePush from '../handlePush/handlePush';
import handleMergeRequest from '../handleMergeRequest/handleMergeRequest';
import {GitLabPush} from "../../ports/outbound/types/GitLabPush/GitLabPush";
import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import handleComment from "../handleComment/handleComment";
import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";


function handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated | GitLabNote): Promise<any> {
    if (webhookPayload.object_kind === "push") {
        let gitlabPush = webhookPayload as GitLabPush;
        const sha = gitlabPush.after;
        const c3prLOG5 = _c3prLOG5({sha, euuid: 'handleWebhook:' + sha});
        c3prLOG5(`Received webhook for PUSH from ${gitlabPush.repository.git_http_url}. Message: '${gitlabPush.commits && gitlabPush.commits[0].message.trim()}'.`, {meta: {gitlabPush}});
        return handlePush(gitlabPush, c3prLOG5);
    }

    if (webhookPayload.object_kind === "merge_request") {
        let gitLabMergeRequestUpdated = webhookPayload as GitLabMergeRequestUpdated;
        const sha = gitLabMergeRequestUpdated.object_attributes.last_commit.id;
        const c3prLOG5 = _c3prLOG5({sha, euuid: 'handleWebhook:' + sha});
        return handleMergeRequest(gitLabMergeRequestUpdated, c3prLOG5);
    }

    if (webhookPayload.object_kind === "note") {
        let gitLabNote = webhookPayload as GitLabNote;
        const c3prLOG5 = _c3prLOG5({sha: gitLabNote.merge_request.last_commit.id, euuid: 'handleComment:'+gitLabNote.merge_request.last_commit.id});
        return handleComment(gitLabNote, c3prLOG5);
    }

    const sha = (webhookPayload as GitLabPush).after || (oattr => oattr && oattr.last_commit && oattr.last_commit.id)((webhookPayload as any).object_attributes) || 'unkown-sha';
    _c3prLOG5(`Received webhook. Unknown type: ${webhookPayload.object_kind}.`, {sha, euuid: 'handleWebhook:' + sha, meta: {webhookPayload}});
}

export { handleWebhook };