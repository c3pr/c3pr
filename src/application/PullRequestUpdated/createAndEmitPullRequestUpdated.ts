import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';

import {GitLabMergeRequestUpdated} from "../../ports/outbound/types/GitLabMergeRequestUpdated/GitLabMergeRequestUpdated";
import config from '../../config';


export function createAndEmitPullRequestUpdated(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated, {lcid, sha, euuid}) {
    const pullRequestUpdated = createPullRequestUpdated(gitLabMergeRequestUpdatedWebhook);
    return emitPullRequestUpdated(pullRequestUpdated, {lcid, sha, euuid});
}

function getStatus(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    switch (gitLabMergeRequestUpdatedWebhook.object_attributes.state) {
        case 'opened': return 'open';
        default: return gitLabMergeRequestUpdatedWebhook.object_attributes.state;
    }
}

function createPullRequestUpdated(gitLabMergeRequestUpdatedWebhook: GitLabMergeRequestUpdated) {
    // Expected message format: "dfasdfasdffd This fix was generated in response to the commit 5aeb86edb4a17cb985c13a4db14a4b66064ef94b.".match(/(\w+)\.$/)[1]
    const revision = gitLabMergeRequestUpdatedWebhook.object_attributes.description.match(/(\w+)\.$/)[1];
    return {
        repository: {
            clone_url_http: gitLabMergeRequestUpdatedWebhook.project.git_http_url,
            revision
        },

        pr_id: gitLabMergeRequestUpdatedWebhook.object_attributes.iid,
        status: getStatus(gitLabMergeRequestUpdatedWebhook),
        assignee: gitLabMergeRequestUpdatedWebhook.assignee && {
            id: gitLabMergeRequestUpdatedWebhook.object_attributes.assignee_id,
            username: gitLabMergeRequestUpdatedWebhook.assignee && gitLabMergeRequestUpdatedWebhook.assignee.username
        },

        'source-webhook': gitLabMergeRequestUpdatedWebhook
    }
}

function emitPullRequestUpdated(pullRequestUpdated, {lcid, sha, euuid}) {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid});
    _c3prLOG5(`Registering new event of type 'PullRequestUpdated' for repository ${pullRequestUpdated.repository.clone_url_http}.`, {meta: {pullRequestUpdated}});

    return c3prHubRegisterNewEvent(
        {
            event_type: `PullRequestUpdated`,
            payload: pullRequestUpdated,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.hub.auth.jwt
        },
        _c3prLOG5
    ).catch(error => {
        _c3prLOG5(`Error while registering new event: PullRequestUpdated.`, {error, meta: {pullRequestUpdated}});
    });
}