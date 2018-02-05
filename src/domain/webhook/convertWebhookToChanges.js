
function convertWebhookToChanges(webhookPayload) {
    const changeset = new Set();
    webhookPayload.commits.forEach(commit => {
        commit.added.forEach(added => changeset.add(added));
        commit.modified.forEach(modified => changeset.add(modified));
        commit.removed.forEach(removed => changeset.delete(removed));
    });

    return {
        changeset: Array.from(changeset.values()),
        repository: {
            type: "git",
            url: webhookPayload.repository.clone_url,
            revision: webhookPayload.after
        }
    }
}

module.exports = convertWebhookToChanges;