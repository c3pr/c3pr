import config from '../../config';
import ports from "../../ports";
import sortCommits = require('../gitlab/sortCommits');
import {GitLabPush} from "../../ports/types/GitLabPush/GitLabPush";

async function extractChangedFiles(urlEncodedOrgNameProjectName, webhookCommits) {
    const commits = sortCommits(webhookCommits);

    const changesetFiles = new Set();
    for(let commit of commits) {
        const modifiedFiles = await ports.getGitLabCommitDiff(urlEncodedOrgNameProjectName, commit.id);
        modifiedFiles.forEach(modifiedFile => {
            if (modifiedFile.new_file) {
                changesetFiles.add(modifiedFile.new_path);
            } else if (modifiedFile.renamed_file) {
                changesetFiles.delete(modifiedFile.old_path);
                changesetFiles.add(modifiedFile.new_path);
            } else if (modifiedFile.deleted_file) {
                changesetFiles.delete(modifiedFile.new_path);
            } else {
                changesetFiles.add(modifiedFile.new_path);
            }
        });
    }

    const changeset = Array.from(changesetFiles.values());
    changeset.sort();
    return changeset;
}

async function convertWebhookToChanges(webhookPayload: GitLabPush) {
    const changed_files = await extractChangedFiles(encodeURIComponent(webhookPayload.project.path_with_namespace), webhookPayload.commits);

    const clone_url_http = config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(webhookPayload.repository.git_http_url);
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(clone_url_http);

    const gitSHA = webhookPayload.after;
    return {
        date: new Date().toISOString(),
        project_uuid,
        changed_files,
        repository: {
            push_user: {id: webhookPayload.user_id, username: webhookPayload.user_username},
            full_path: webhookPayload.project.path_with_namespace,
            clone_url_http,

            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

export = convertWebhookToChanges;