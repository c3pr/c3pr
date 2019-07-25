import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import extractRevisionFromMrDescription from "../PullRequestUpdated/extractRevisionFromMrDescription";
import {getStatus} from "../PullRequestUpdated/getStatus";

function escapeUsernameForReply(username) {
    return '@' + username.replace(/-/g, '\\-');
}

function mentionsC3prBotNickname(text: string) {
    return text.includes('@c3pr-bot') || text.includes('@c3pr\\-bot') || text.includes('@c3pr\\\\-bot');
}

export default function createPullRequestUpdatedFromNoteHook(gitLabNoteWebhook: GitLabNote) {
    return {
        repository: {
            clone_url_http: gitLabNoteWebhook.project.git_http_url,
            revision: extractRevisionFromMrDescription(gitLabNoteWebhook.merge_request.description, gitLabNoteWebhook.merge_request.source_branch)
        },

        pr_id: gitLabNoteWebhook.merge_request.iid,
        status: getStatus(gitLabNoteWebhook.merge_request.state),
        assignee: gitLabNoteWebhook.merge_request.assignee_id && {
            id: gitLabNoteWebhook.merge_request.assignee_id,
            username: null
        },

        command: 'COMMENT_ADDED',
        args: {
            pr_id: gitLabNoteWebhook.merge_request.iid,
            bot_is_mentioned: mentionsC3prBotNickname(gitLabNoteWebhook.object_attributes.note),
            text: gitLabNoteWebhook.object_attributes.note,
            author: {
                id: gitLabNoteWebhook.object_attributes.author_id,
                mention_handle: escapeUsernameForReply(gitLabNoteWebhook.user.username)
            }
        },

        source_webhook: gitLabNoteWebhook
    }
}
