const config = require('../../config');
const sortCommits = require('../gitlab/sortCommits');

function extractChangedFiles(webhookCommits) {
    /** @type {Array} */
    const commits = sortCommits(webhookCommits);

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
    const changed_files = extractChangedFiles(webhookPayload.commits);

    const gitSHA = webhookPayload.after;
    return {
        date: new Date().toISOString(),
        changed_files,
        repository: {
            author: webhookPayload.user_username,
            full_path: webhookPayload.project.path_with_namespace,
            clone_url_http: config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(webhookPayload.repository.git_http_url),

            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

module.exports = convertWebhookToChanges;