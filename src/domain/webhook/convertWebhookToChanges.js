
function convertWebhookToChanges(webhookPayload) {
    const changeset = new Set();
    webhookPayload.commits.forEach(commit => {
        commit.added.forEach(added => changeset.add(added));
        commit.modified.forEach(modified => changeset.add(modified));
        commit.removed.forEach(removed => changeset.delete(removed));
    });

    const gitSHA = webhookPayload.after;
    return {
        meta: {
            correlationId: gitSHA,
            compatibleSchemas: ["c3pr/c3pr::changes"]
        },
        changeset: Array.from(changeset.values()),
        repository: {
            type: "git",
            url: webhookPayload.repository.clone_url,
            revision: gitSHA
        }
    }
}

module.exports = convertWebhookToChanges;