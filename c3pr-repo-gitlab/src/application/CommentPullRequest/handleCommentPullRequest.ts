import {Event} from 'node-c3pr-hub-client';
import handleEventById from 'node-c3pr-hub-client/events/handleEventById';
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';

import config from '../../config';
import {createComment} from "../../adapters/outbound/gitlab/createComment";


export async function handleCommentPullRequest(request, c3prLOG5): Promise<any> {
    c3prLOG5 = c3prLOG5({caller_name: 'handleCommentPullRequest'});
    c3prLOG5('Attempting to handle CommentPullRequest.', {meta: request});

    return handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction: handlerFunction as any,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
    }, c3prLOG5);
}

function extractGroupAndName(clone_url_http) {
    return clone_url_http.replace(/^http:\/\/[^/]+\//, '').replace(/\.git$/, '');
}

async function handlerFunction(commentPullRequestEvent: Event<any>, c3prLOG5): Promise<any> {
    c3prLOG5 = c3prLOG5({caller_name: 'handleCommentPullRequest#hf'});

    const cpr = commentPullRequestEvent.payload;

    c3prLOG5(`Commenting on MR '${cpr.args.pr_id}' of project '${cpr.repository.clone_url_http}'`, {meta: {commentPullRequestEvent}});

    try {
        let createCommentResponse = await createComment(
            cpr.repository.full_path || extractGroupAndName(cpr.repository.clone_url_http),
            cpr.args.pr_id,
            cpr.args.text,
            c3prLOG5
        );

        c3prLOG5(`Comment created successfully.`, {meta: {commentPullRequestEvent, createCommentResponse}});

        return {new_status: 'PROCESSED', result: {commentPullRequestEvent, createCommentResponse}}
    } catch (error) {
        return await emitCommentPullRequestFailed(commentPullRequestEvent, error.toString(), c3prLOG5)
    }
}

async function emitCommentPullRequestFailed(commentPullRequestEvent, failure_message, c3prLOG5): Promise<{new_status, result}> {
    const commentPullRequest = commentPullRequestEvent.payload;
    const meta = {commentPullRequestEvent, failure_message};
    const parent = {event_type: commentPullRequestEvent.event_type, uuid: commentPullRequestEvent.uuid};

    try {
        let result = await c3prHubRegisterNewEvent(
            {
                event_type: `CommentPullRequestFailed`,
                payload: {
                    parent,
                    repository: commentPullRequest.repository,
                    failure_message
                },
                c3prHubUrl: config.c3pr.hub.c3prHubUrl,
                jwt: config.c3pr.hub.auth.jwt
            },
            c3prLOG5
        );
        c3prLOG5(`CommentPullRequest creation failed. Reason: ${failure_message}`, {meta});
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        c3prLOG5(`Error while registering new event: CommentPullRequestFailed.`, {error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    }
}