const config = require('../../config');

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
            compatibleSchemas: ["c3pr/c3pr::changes"],
            dates: [{node: 'c3pr-repo-github', date: new Date().toISOString()}]
        },
        c3pr: {
            prsUrl: config.c3pr.prsUrl
        },
        changeset: Array.from(changeset.values()),
        repository: {
            type: "git",
            url: webhookPayload.repository.clone_url,
            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

module.exports = convertWebhookToChanges;