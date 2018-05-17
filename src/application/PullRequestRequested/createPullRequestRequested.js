
function createPullRequestRequested(toolInvocationCompleted) {
    return {
        parent: {
            event_type: toolInvocationCompleted.event_type,
            uuid: toolInvocationCompleted.uuid
        },

        repository: toolInvocationCompleted.payload.repository,

        assignee: toolInvocationCompleted.payload.repository.author,
        pr_title: toolInvocationCompleted.payload.pr_title,
        pr_body: toolInvocationCompleted.payload.pr_body,
        diff_base64: toolInvocationCompleted.payload.diff_base64
    };

}

module.exports = {
    c3pr: {
        createPullRequestRequested
    }
};
