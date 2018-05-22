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
        changeset,
        repository: {
            full_path: webhookPayload.repository.full_name,
            get author() { throw new Error() },
            clone_url_http: webhookPayload.repository.clone_url,
            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

module.exports = convertWebhookToChanges;