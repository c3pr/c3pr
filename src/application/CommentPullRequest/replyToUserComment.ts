import config from '../../config';
import c3prHubRegisterNewEvent from "node-c3pr-hub-client/events/registerNewEvent";
import {generateResponseForComment} from "../comments/processComment";

export default async function replyToUserComment(pullRequestUpdated, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'replyToUserComment'});
    if (!pullRequestUpdated.payload.args.bot_is_mentioned) {
        c3prLOG5(`bot is not mentioned in comment "${pullRequestUpdated.payload.args.text}" from ${pullRequestUpdated.payload.args.author.mention_handle}. Skipping.`, {meta: {pullRequestUpdated}});
        return;
    }
    c3prLOG5('Calculating reply to comment "'+pullRequestUpdated.payload.args.text+ '" from '+ pullRequestUpdated.payload.args.author.mention_handle, {meta: {pullRequestUpdated}});

    let reply_text = generateResponseForComment(pullRequestUpdated.payload.args.text, pullRequestUpdated.payload.args.author.mention_handle);
    return emitCommentPullRequest(pullRequestUpdated, reply_text, c3prLOG5);
}

function emitCommentPullRequest(pullRequestUpdated, reply_text, c3prLOG5) {
    c3prLOG5(`Registering new event of type 'CommentPullRequest' for ${pullRequestUpdated.payload.repository.clone_url_http}: ${reply_text}`,
        {meta: {pullRequestUpdated: pullRequestUpdated.payload, text: reply_text}});

    return c3prHubRegisterNewEvent(
        {
            event_type: `CommentPullRequest`,
            payload: {
                parent: {
                    event_type: pullRequestUpdated.event_type,
                    uuid: pullRequestUpdated.uuid,
                },
                repository: pullRequestUpdated.payload.repository,
                command: 'ADD_BOT_COMMENT',
                args: {
                    pr_id: pullRequestUpdated.payload.args.pr_id,
                    text: reply_text
                }
            },
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: CommentPullRequest.`, {error});
    });
}