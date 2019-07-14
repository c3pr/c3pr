import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import extractRevisionFromMrDescription from "../PullRequestUpdated/extractRevisionFromMrDescription";
import {CommandEvent} from 'node-c3pr-hub-client/events/produceCommandEvent';

export default function createPullRequestUpdatedFromNoteHook(gitLabNoteWebhook: GitLabNote): CommandEvent {
    return {
        event_type: 'PullRequestUpdated',
        project_clone_http_url: gitLabNoteWebhook.project.git_http_url,
        commit_hash: extractRevisionFromMrDescription(gitLabNoteWebhook.merge_request.description),
        command: 'ADD_COMMENT',
        args: {
            pr_id: gitLabNoteWebhook.merge_request.iid,
            text: gitLabNoteWebhook.object_attributes.note
        },
        meta: {
            source_webhook: gitLabNoteWebhook
        }
    }
}
