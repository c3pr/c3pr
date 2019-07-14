import {createAndEmitPullRequestUpdated} from "../PullRequestUpdated/createAndEmitPullRequestUpdated";
import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import config from "../../config";


export default function handleMergeRequest(webhookPayload: GitLabMergeRequestUpdated, c3prLOG5) {
    c3prLOG5(
        `Handling MR action:${webhookPayload.object_attributes.action} for ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes.title.trim()}'.`,
        {meta: {webhookPayload}}
    );

    if (webhookPayload.object_attributes.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG5(`MR event is ignored. The PR is not authored by the bot.`, {meta: {webhookPayload, bot_user_id: config.c3pr.repoGitlab.gitlab.bot_user_id}});
        return;
    }
    if (webhookPayload.object_attributes.action === 'open' && webhookPayload.changes.state === undefined) {
        c3prLOG5(`MR 'open' event is ignored. The PR will be first created in the database by the PullRequestCreated event.`, {meta: {webhookPayload}});
        return;
    }

    return createAndEmitPullRequestUpdated(webhookPayload, c3prLOG5);
}