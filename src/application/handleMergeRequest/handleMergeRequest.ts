import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

import {createAndEmitPullRequestUpdated} from "../PullRequestUpdated/createAndEmitPullRequestUpdated";
import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import config from "../../config";


export default function handleMergeRequest(webhookPayload: GitLabMergeRequestUpdated, {lcid, sha, euuid}) {
    c3prLOG4(
        `Handling MR action:${webhookPayload.object_attributes.action} for ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes.title.trim()}'.`,
        {lcid, sha, euuid, meta: {webhookPayload}}
    );

    if (webhookPayload.object_attributes.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG4(`MR event is ignored. The PR is not authored by the bot.`, {lcid, sha, euuid, meta: {webhookPayload, bot_user_id: config.c3pr.repoGitlab.gitlab.bot_user_id}});
        return;
    }
    if (webhookPayload.object_attributes.action === 'open' && webhookPayload.changes.state === undefined) {
        c3prLOG4(`MR 'open' event is ignored. The PR will be first created in the database by the PullRequestCreated event.`, {lcid, sha, euuid, meta: {webhookPayload}});
        return;
    }

    return createAndEmitPullRequestUpdated(webhookPayload, {lcid, sha, euuid});
}