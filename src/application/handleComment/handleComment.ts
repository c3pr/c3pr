import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import createPullRequestUpdatedFromNoteHook from "./createPullRequestUpdatedFromNoteHook";
import config from "../../config";
import extractRevisionFromMrDescription from "../PullRequestUpdated/extractRevisionFromMrDescription";
import emitPullRequestUpdated from "../PullRequestUpdated/emitPullRequestUpdated";


export default async function handleComment(gitLabNote: GitLabNote, c3prLOG5) {
    if (gitLabNote.merge_request.author_id !== config.c3pr.repoGitlab.gitlab.bot_user_id) {
        c3prLOG5(`Note event is ignored. The PR is not authored by the bot.`, {meta: {gitLabNote, bot_user_id: config.c3pr.repoGitlab.gitlab.bot_user_id}});
        return;
    }
    const sha = extractRevisionFromMrDescription(gitLabNote.merge_request.description);
    c3prLOG5 = c3prLOG5({sha, euuid: 'note-webhook:'+gitLabNote.object_attributes.id});

    c3prLOG5(`Handling comment "${gitLabNote.object_attributes.note}".`, {caller_name: 'handleComment', meta: {noteWebhook: gitLabNote}});

    const pullRequestUpdated = createPullRequestUpdatedFromNoteHook(gitLabNote);
    return emitPullRequestUpdated(pullRequestUpdated, c3prLOG5);
}
