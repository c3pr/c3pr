import {createAndEmitChangesCommitted} from '../ChangesCommitted/createAndEmitChangesCommitted';

export default function handlePush(webhookPayload, c3prLOG5) {
    const lastCommit = webhookPayload.commits[0];
    c3prLOG5(`Handling webhook invoked for ${webhookPayload.repository.git_http_url}. Message: '${lastCommit.message.trim()}'.`, {meta: {webhookPayload}});

    return createAndEmitChangesCommitted(webhookPayload, c3prLOG5)
        .catch(error => {
            c3prLOG5(`Error while handling webhook.`, {meta: {webhookPayload}, error});
        });
}