const config = require('../../config');

function extractChangedFiles(webhookCommits) {
    const commits = [...webhookCommits];
    commits.sort((a, b) => {
        return a.timestamp.localeCompare(b.timestamp);
    });

    const changesetFiles = new Set();
    commits.forEach(commit => {
        commit.added.forEach(added => changesetFiles.add(added));
        commit.modified.forEach(modified => changesetFiles.add(modified));
        commit.removed.forEach(removed => changesetFiles.delete(removed));
    });

    const changeset = Array.from(changesetFiles.values());
    changeset.sort();
    return changeset;
}

function convertWebhookToChanges(webhookPayload) {
    const changeset = extractChangedFiles(webhookPayload.commits);
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
        changeset,
        repository: {
            type: "git",
            fullpath: webhookPayload.repository.full_name,
            url: webhookPayload.repository.clone_url,
            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

module.exports = convertWebhookToChanges;