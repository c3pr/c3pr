import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";

function getStatus(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    switch (gitLabMergeRequestUpdatedWebhook.object_attributes.state) {
        case 'opened': return 'open';
        default: return gitLabMergeRequestUpdatedWebhook.object_attributes.state;
    }
}

function getCommand(action: 'open' | 'merge' | 'reopen' | 'close' | 'update') {
    return (action + '_pull_request').toUpperCase();
}

export default function createPullRequestUpdatedFromMergeRequestHook(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    // Expected message format: "dfasdfasdffd This fix was generated in response to the commit 5aeb86edb4a17cb985c13a4db14a4b66064ef94b.".match(/(\w+)\.$/)[1]
    const revision = gitLabMergeRequestUpdatedWebhook.object_attributes.description.match(/(\w+)\.$/)[1];
    return {
        repository: {
            clone_url_http: gitLabMergeRequestUpdatedWebhook.project.git_http_url,
            revision
        },

        pr_id: gitLabMergeRequestUpdatedWebhook.object_attributes.iid,
        status: getStatus(gitLabMergeRequestUpdatedWebhook),
        assignee: gitLabMergeRequestUpdatedWebhook.assignee && {
            id: gitLabMergeRequestUpdatedWebhook.object_attributes.assignee_id,
            username: gitLabMergeRequestUpdatedWebhook.assignee && gitLabMergeRequestUpdatedWebhook.assignee.username
        },

        command: getCommand(gitLabMergeRequestUpdatedWebhook.object_attributes.action),

        'source-webhook': gitLabMergeRequestUpdatedWebhook
    }
}
