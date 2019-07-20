import config from '../../config';
import ports from "../../ports/outbound";
import {Commit, GitLabPush} from "../../ports/outbound/types/GitLabPush/GitLabPush";
import {sortCommits} from "./sortCommits";
import {ChangesCommitted} from "./ChangesCommitted";


async function extractChangedFiles(urlEncodedOrgNameProjectName, webhookCommits: Commit[], c3prLOG5) {
    const commits = sortCommits(webhookCommits);

    const changesetFiles = new Set();
    let renames = [];
    for(let commit of commits) {
        if (commit.author.email === config.c3pr.repoGitlab.gitlab.botUserEmail) {
            c3prLOG5(`Skipping commit ${commit.id}, since its author is the bot (${commit.author.email}).`, {meta: {commit}});
            continue;
        }
        const gitLabCommit = await ports.getGitLabCommit(urlEncodedOrgNameProjectName, commit.id);
        if (gitLabCommit.parent_ids.length > 1) {
            c3prLOG5(`Skipping commit ${commit.id}, because it is a merge.`, {meta: {commit, gitLabCommit}});
            continue;
        }

        const modifiedFiles = await ports.getGitLabCommitDiff(urlEncodedOrgNameProjectName, commit.id);
        modifiedFiles.forEach(modifiedFile => {
            if (modifiedFile.new_file) {
                changesetFiles.add(modifiedFile.new_path);
            } else if (modifiedFile.renamed_file) {
                changesetFiles.delete(modifiedFile.old_path);
                changesetFiles.add(modifiedFile.new_path);

                renames.push({from: modifiedFile.old_path, to: modifiedFile.new_path});
            } else if (modifiedFile.deleted_file) {
                changesetFiles.delete(modifiedFile.new_path);
            } else {
                changesetFiles.add(modifiedFile.new_path); // here new_path === old_path, so either would work
            }
        });
    }

    const changed_files = Array.from(changesetFiles.values());
    changed_files.sort();
    return {changed_files, renames};
}

async function createChangesCommitted(webhookPayload: GitLabPush, c3prLOG5): Promise<ChangesCommitted> {
    const {changed_files, renames} = await extractChangedFiles(encodeURIComponent(webhookPayload.project.path_with_namespace), webhookPayload.commits, c3prLOG5);

    const clone_url_http = config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(webhookPayload.repository.git_http_url);
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(clone_url_http);

    return {
        project_uuid,
        repository: {
            push_user: {id: webhookPayload.user_id, username: webhookPayload.user_username},
            full_path: webhookPayload.project.path_with_namespace,
            clone_url_http,

            // TODO maybe it would be safer to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: webhookPayload.after
        },
        changed_files,
        renames,
        source_webhook: webhookPayload
    }
}

export { createChangesCommitted };