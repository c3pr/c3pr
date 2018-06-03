import {c3prLOG2} from "node-c3pr-logger/c3prLOG2";
import {c3prRNE} from 'node-c3pr-hub-client/events/registerNewEvent';
import {GitLabMergeRequestUpdated} from "../../ports/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import config from '../../config';

export function createAndEmitPullRequestUpdated(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    const pullRequestUpdated = createPullRequestUpdated(gitLabMergeRequestUpdatedWebhook);
    return emitPullRequestUpdated(pullRequestUpdated);
}

function createPullRequestUpdated(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    return {
        repository: {
            clone_url_http: gitLabMergeRequestUpdatedWebhook.project.git_http_url
        },

        pr_id: gitLabMergeRequestUpdatedWebhook.object_attributes.iid,
        status: gitLabMergeRequestUpdatedWebhook.object_attributes.state,
        assignee: {
            id: gitLabMergeRequestUpdatedWebhook.object_attributes.assignee_id,
            username: gitLabMergeRequestUpdatedWebhook.assignee && gitLabMergeRequestUpdatedWebhook.assignee.username
        },

        'source-webhook': gitLabMergeRequestUpdatedWebhook
    }
}

function emitPullRequestUpdated(pullRequestUpdated) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', correlationId: pullRequestUpdated.pr_id, moduleName: 'emitPullRequestUpdated'}];

    c3prLOG2({msg: `Registering new event of type 'PullRequestUpdated' for repository ${pullRequestUpdated.repository.clone_url_http}.`, logMetas, meta: {pullRequestUpdated}});

    return c3prRNE.registerNewEvent({
        event_type: `PullRequestUpdated`,
        payload: pullRequestUpdated,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        logMetas
    })
        .catch(error => {
            c3prLOG2({msg: `Error while registering new event: PullRequestUpdated.`, logMetas, error, meta: {pullRequestUpdated}});
        })
}