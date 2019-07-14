import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import {getStatus} from "./getStatus";
import extractRevisionFromMrDescription from "./extractRevisionFromMrDescription";

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
            text: gitLabNoteWebhook.object_attributes.note
        },

        'source-webhook': gitLabNoteWebhook
    }
}