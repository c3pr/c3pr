import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

import handlePush from '../handlePush/handlePush';
import handleMergeRequest from '../handleMergeRequest/handleMergeRequest';
import {GitLabPush} from "../../ports/outbound/types/GitLabPush/GitLabPush";
import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";


function handleWebhook(webhookPayload: GitLabPush | GitLabMergeRequestUpdated): Promise<any> {
    const lcid = c3prLOG4.lcid();
    if (webhookPayload.object_kind === "push") {
        let gitlabPush = webhookPayload as GitLabPush;
        const euuid = 'gitlab-push:' + gitlabPush.after;
        const sha = gitlabPush.after;
        c3prLOG4(`Received webhook for PUSH from ${gitlabPush.repository.git_http_url}. Message: '${gitlabPush.commits && gitlabPush.commits[0].message.trim()}'.`, {lcid, sha, euuid});
        return handlePush(gitlabPush, {lcid, sha, euuid});
    }

    if (webhookPayload.object_kind === "merge_request") {
        let gitLabMergeRequestUpdated = webhookPayload as GitLabMergeRequestUpdated;
        const euuid = 'gitlab-mru:' + gitLabMergeRequestUpdated.object_attributes.last_commit.id;
        const sha = gitLabMergeRequestUpdated.object_attributes.last_commit.id;
        return handleMergeRequest(gitLabMergeRequestUpdated, {lcid, sha, euuid});
    }

    const sha = (webhookPayload as GitLabPush).after || (oattr => oattr && oattr.last_commit && oattr.last_commit.id)((webhookPayload as any).object_attributes);
    const euuid = 'gitlab-unknown:' + sha;
    c3prLOG4(`Received webhook. Unknown type: ${webhookPayload.object_kind}.`, {lcid, sha, euuid, meta: {webhookPayload}});
}

export { handleWebhook };