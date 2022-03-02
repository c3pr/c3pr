
function createPullRequestRequested(toolInvocationCompleted) {
    return {
        parent: {
            event_type: toolInvocationCompleted.event_type,
            uuid: toolInvocationCompleted.uuid
        },
        changes_committed_root: toolInvocationCompleted.payload.changes_committed_root,

        repository: toolInvocationCompleted.payload.repository,

        assignee: toolInvocationCompleted.payload.repository.push_user,
        pr_title: toolInvocationCompleted.payload.pr_title,
        pr_body: toolInvocationCompleted.payload.pr_body,
        diff_base64: toolInvocationCompleted.payload.diff_base64
    };

}

export = {
    c3pr: {
        createPullRequestRequested
    }
};
