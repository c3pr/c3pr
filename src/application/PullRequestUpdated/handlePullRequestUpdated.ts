import config from '../../config';
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";
import handleEventById from "node-c3pr-hub-client/events/handleEventById";
import replyToUserComment from "../CommentPullRequest/replyToUserComment";

export default function handlePullRequestUpdated(request, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestUpdated'});

    return handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}

async function handlerFunction(pullRequestUpdatedEvent, c3prLOG5): Promise<any> {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestUpdated#hF'});

    if (pullRequestUpdatedEvent.payload.command === 'COMMENT_ADDED') {
        await replyToUserComment(pullRequestUpdatedEvent, c3prLOG5);
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
