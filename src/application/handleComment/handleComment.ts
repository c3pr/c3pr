import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";
import createPullRequestUpdatedFromNoteHook from "../PullRequestUpdated/createPullRequestUpdatedFromNoteHook";
import emitPullRequestUpdated from "../PullRequestUpdated/emitPullRequestUpdated";

export default async function handleComment(gitLabNote: GitLabNote, c3prLOG5) {
    c3prLOG5(`Handling comment "${gitLabNote.object_attributes.note}".`, {caller_name: 'handleComment', meta: {noteWebhook: gitLabNote}});

    const pullRequestUpdated = createPullRequestUpdatedFromNoteHook(gitLabNote);
    return emitPullRequestUpdated(pullRequestUpdated, c3prLOG5);
}