import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import {getStatus} from "./getStatus";
import extractRevisionFromMrDescription from "./extractRevisionFromMrDescription";

function getCommand(action: 'open' | 'merge' | 'reopen' | 'close' | 'update') {
    return (action + '_pull_request').toUpperCase();
}

export default function createPullRequestUpdatedFromMergeRequestHook(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    return {
        repository: {
            clone_url_http: gitLabMergeRequestUpdatedWebhook.project.git_http_url,
            revision: extractRevisionFromMrDescription(gitLabMergeRequestUpdatedWebhook.object_attributes.description)
        },

        pr_id: gitLabMergeRequestUpdatedWebhook.object_attributes.iid,
        status: getStatus(gitLabMergeRequestUpdatedWebhook.object_attributes.state),
        assignee: gitLabMergeRequestUpdatedWebhook.assignee && {
            id: gitLabMergeRequestUpdatedWebhook.object_attributes.assignee_id,
            username: gitLabMergeRequestUpdatedWebhook.assignee && gitLabMergeRequestUpdatedWebhook.assignee.username
        },

        command: getCommand(gitLabMergeRequestUpdatedWebhook.object_attributes.action),

        source_webhook: gitLabMergeRequestUpdatedWebhook
    }
}
