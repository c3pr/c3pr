import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import extractRevisionFromMrDescription from "../PullRequestUpdated/extractRevisionFromMrDescription";
import {getStatus} from "../PullRequestUpdated/getStatus";

function escapeUsernameForReply(username) {
    return '@' + username.replace(/-/g, '\\-');
}

export default function createPullRequestUpdatedFromNoteHook(gitLabNoteWebhook: GitLabNote) {
    return {
        repository: {
            clone_url_http: gitLabNoteWebhook.project.git_http_url,
            revision: extractRevisionFromMrDescription(gitLabNoteWebhook.merge_request.description)
        },

        pr_id: gitLabNoteWebhook.merge_request.iid,
        status: getStatus(gitLabNoteWebhook.merge_request.state),
        assignee: gitLabNoteWebhook.merge_request.assignee_id && {
            id: gitLabNoteWebhook.merge_request.assignee_id,
            username: null
        },

        command: 'ADD_COMMENT',
        args: {
            pr_id: gitLabNoteWebhook.merge_request.iid,
            text: gitLabNoteWebhook.object_attributes.note,
            author: {
                id: gitLabNoteWebhook.object_attributes.author_id,
                mention_handle: escapeUsernameForReply(gitLabNoteWebhook.user.username)
            }
        },

        source_webhook: gitLabNoteWebhook
    }
}
