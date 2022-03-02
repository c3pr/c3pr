import {Event} from 'node-c3pr-hub-client';
import {GitLabMergeRequestCreated} from "../../ports/outbound/types/GitLabMergeRequestCreated/GitLabMergeRequestCreated";


export function createPullRequestCreated(pullRequestRequestedEvent: Event<any>, createMrResult: GitLabMergeRequestCreated) {
    return {
        parent: {
            event_type: pullRequestRequestedEvent.event_type,
            uuid: pullRequestRequestedEvent.uuid
        },
        changes_committed_root: pullRequestRequestedEvent.payload.changes_committed_root,

        repository: pullRequestRequestedEvent.payload.repository,

        pr_id: createMrResult.iid,
        pr_url: createMrResult.web_url,
        assignee: createMrResult.assignee && {id: createMrResult.assignee.id, username: createMrResult.assignee.username}
    }
}