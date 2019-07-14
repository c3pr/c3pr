import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import createPullRequestUpdatedFromNoteHook from "../PullRequestUpdated/createPullRequestUpdatedFromNoteHook";
import emitPullRequestUpdated from "../PullRequestUpdated/emitPullRequestUpdated";
import config from "../../config";

export default async function handleComment(gitLabNote: GitLabNote, c3prLOG5) {
    if (gitLabNote.merge_request.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG5(`Note event is ignored. The PR is not authored by the bot.`, {meta: {gitLabNote, bot_user_id: config.c3pr.repoGitlab.gitlab.bot_user_id}});
        return;
    }

    c3prLOG5(`Handling comment "${gitLabNote.object_attributes.note}".`, {caller_name: 'handleComment', meta: {noteWebhook: gitLabNote}});

    const pullRequestUpdated = createPullRequestUpdatedFromNoteHook(gitLabNote);
    return emitPullRequestUpdated(pullRequestUpdated, c3prLOG5);
}