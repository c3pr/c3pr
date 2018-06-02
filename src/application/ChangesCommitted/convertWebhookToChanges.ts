import axios from 'axios';
import config from '../../config';
import sortCommits = require('../gitlab/sortCommits');

async function extractChangedFiles(urlEncodedOrgNameProjectName, webhookCommits) {
    /** @type {Array} */
    const commits = sortCommits(webhookCommits);

    const changesetFiles = new Set();
    for(let commit of commits) {
        const {data: modifiedFiles} = await axios.get(
            `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${urlEncodedOrgNameProjectName}/repository/commits/${commit.id}/diff`,
            {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
        );
        modifiedFiles.forEach(modifiedFile => {
            /** @namespace modifiedFile.old_path */
            /** @namespace modifiedFile.new_path */
            /** @namespace modifiedFile.new_file */
            /** @namespace modifiedFile.renamed_file */
            /** @namespace modifiedFile.deleted_file */
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

async function convertWebhookToChanges(webhookPayload) {
    const headers = {Authorization: `Bearer ${config.c3pr.hub.auth.jwt}`};

    const changed_files = await extractChangedFiles(encodeURIComponent(webhookPayload.project.path_with_namespace), webhookPayload.commits);

    const clone_url_http = config.c3pr.repoGitlab.gitlab.normalizeGitLabUrl(webhookPayload.repository.git_http_url);

    const {data} = await axios.get(config.c3pr.hub.projectByCloneUrlHttp.replace(/:clone_url_http/, clone_url_http), {headers});
    if (!data.length) {
        throw new Error('Project with URL ' + clone_url_http + ' not found.');
    }
    const [{uuid: project_uuid}] = data;

    const gitSHA = webhookPayload.after;
    return {
        date: new Date().toISOString(),
        project_uuid,
        changed_files,
        repository: {
            author: webhookPayload.user_username,
            full_path: webhookPayload.project.path_with_namespace,
            clone_url_http,

            // TODO maybe it would be more secure to send down the refs and git fetch the refs instead of the branch... This seems rather sketchy
            branch: webhookPayload.ref.replace(/refs\/heads\//, ''),
            revision: gitSHA
        }
    }
}

export = convertWebhookToChanges;