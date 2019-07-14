import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import createPullRequestUpdatedFromNoteHook from "./createPullRequestUpdatedFromNoteHook";
import config from "../../config";
import extractRevisionFromMrDescription from "../PullRequestUpdated/extractRevisionFromMrDescription";
import produceCommandEvent, {CommandEvent} from 'node-c3pr-hub-client/events/produceCommandEvent';

export default async function handleComment(gitLabNote: GitLabNote, c3prLOG5) {
    if (gitLabNote.merge_request.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG5(`Note event is ignored. The PR is not authored by the bot.`, {meta: {gitLabNote, bot_user_id: config.c3pr.repoGitlab.gitlab.bot_user_id}});
        return;
    }
    const sha = extractRevisionFromMrDescription(gitLabNote.merge_request.description);
    c3prLOG5 = c3prLOG5({sha, euuid: 'note-webhook:'+gitLabNote.object_attributes.id});

    c3prLOG5(`Handling comment "${gitLabNote.object_attributes.note}".`, {caller_name: 'handleComment', meta: {noteWebhook: gitLabNote}});

    const pullRequestUpdated: CommandEvent = createPullRequestUpdatedFromNoteHook(gitLabNote);
    return emitPullRequestUpdated(pullRequestUpdated, c3prLOG5);
}

function emitPullRequestUpdated(pullRequestUpdated: CommandEvent, c3prLOG5) {
    c3prLOG5(`Registering new event of type 'PullRequestUpdated' for repository ${pullRequestUpdated.project_clone_http_url}.`, {meta: {pullRequestUpdated}});

    return produceCommandEvent(
        pullRequestUpdated,
        {
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.hub.auth.jwt
        },
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: PullRequestUpdated.`, {error, meta: {pullRequestUpdated}});
    });
}