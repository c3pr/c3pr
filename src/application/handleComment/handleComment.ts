import {GitLabNote} from "../../ports/outbound/types/GitLabNote/GitLabNote";

export default async function handleComment(gitLabNote: GitLabNote, c3prLOG5) {
    c3prLOG5('Handling comment.', {caller_name: 'handleComment', meta: {noteWebhook: gitLabNote}})
    console.log(JSON.stringify(gitLabNote));
}