import config from '../../config';
import ports from "../../ports/outbound";
import {Commit, GitLabPush} from "../../ports/outbound/types/GitLabPush/GitLabPush";
import {sortCommits} from "./sortCommits";
import {c3prLOG2} from "node-c3pr-logger/c3prLOG2";


const logMetaz = (correlationId) => [{nodeName: 'c3pr-repo-gitlab', correlationId, moduleName: 'convertWebhookToChanges'}];


async function extractChangedFiles(urlEncodedOrgNameProjectName, webhookCommits: Commit[]) {
    const commits = sortCommits(webhookCommits);

    const changesetFiles = new Set();
    for(let commit of commits) {
        const logMetas = logMetaz(commit.id);
        if (commit.author.email === config.c3pr.repoGitlab.gitlab.botUserEmail) {
            c3prLOG2({msg: `Skipping commit ${commit.id}, since its author is the bot (${commit.author.email}).`, meta: {commit}, logMetas});
            continue;
        }
        const gitLabCommit = await ports.getGitLabCommit(urlEncodedOrgNameProjectName, commit.id);
        if (gitLabCommit.parent_ids.length > 1) {
            c3prLOG2({msg: `Skipping commit ${commit.id}, because it is a merge.`, meta: {commit, gitLabCommit}, logMetas});
            continue;
        }

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

async function createChangesCommitted(webhookPayload: GitLabPush) {
    const changed_files = await extractChangedFiles(encodeURIComponent(webhookPayload.project.path_with_namespace), webhookPayload.commits);

    const clone_url_http = config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(webhookPayload.repository.git_http_url);
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(clone_url_http);

    return {
        date: new Date().toISOString(),
        project_uuid,
        repository: {
            push_user: {id: webhookPayload.user_id, username: webhookPayload.user_username},
            full_path: webhookPayload.project.path_with_namespace,
            clone_url_http,

            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: webhookPayload.after
        },
        changed_files,
        'source-webhook': webhookPayload
    }
}

export { createChangesCommitted };