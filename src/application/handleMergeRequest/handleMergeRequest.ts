import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import {createAndEmitPullRequestUpdated} from "../PullRequestUpdated/createAndEmitPullRequestUpdated";
import {GitLabMergeRequestUpdated} from "../../ports/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import config from "../../config";


function handleMergeRequest(webhookPayload: GitLabMergeRequestUpdated) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handleMergeRequest'}];

    c3prLOG2({
        msg: `Handling MR action:${webhookPayload.object_attributes.action} for ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes.title.trim()}'.`,
        logMetas,
        meta: {webhookPayload}
    });

    if (webhookPayload.object_attributes.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG2({msg: `MR event is ignored. The PR is not authored by the bot.`, logMetas, meta: {webhookPayload}});
        return
    }
    if (webhookPayload.object_attributes.action === 'open' && webhookPayload.changes.state === undefined) {
        c3prLOG2({msg: `MR 'open' event is ignored. The PR will be first created in the database by the PullRequestCreated event.`, logMetas, meta: {webhookPayload}});
        return
    }

    return createAndEmitPullRequestUpdated(webhookPayload);
}

export default handleMergeRequest;