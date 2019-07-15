import config from '../../config';
import _c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";

export default function handlePullRequestUpdated(c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestUpdated'});
    return handleFirstCollectedEvent({
            event_type: `PullRequestUpdated`,
            handlerFunction,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        c3prLOG5
    );
}

async function handlerFunction(pullRequestUpdatedEvent, {lcid, sha, euuid}): Promise<any> {
    const c3prLOG5 = _c3prLOG5({lcid, sha, euuid, caller_name: 'handlePullRequestUpdated#hF'});

    if (pullRequestUpdatedEvent.payload.command === 'ADD_COMMENT') {
        return {new_status: 'PROCESSED', result: 'nothing-to-do'};
    }

    return updatePR(pullRequestUpdatedEvent, c3prLOG5);
}

async function updatePR(pullRequestUpdatedEvent, c3prLOG5) {
    const project_uuid = await fetchFirstProjectForCloneUrl(pullRequestUpdatedEvent.payload.repository.clone_url_http);

    let result = await updatePrOfProject(project_uuid, pullRequestUpdatedEvent.payload.pr_id, pullRequestUpdatedEvent.payload.status, pullRequestUpdatedEvent.payload.assignee);
    c3prLOG5(
        `Updated PR ${pullRequestUpdatedEvent.payload.pr_id} in database for project ${pullRequestUpdatedEvent.payload.repository.clone_url_http}`,
        {meta: {pullRequestUpdatedEvent, project_uuid}}
    );
    return {new_status: 'PROCESSED', result};
}
