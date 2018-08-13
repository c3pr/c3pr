import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

import { createAndEmitChangesCommitted } from '../ChangesCommitted/createAndEmitChangesCommitted';

export default function handlePush(webhookPayload, {lcid, sha, euuid}) {
    const lastCommit = webhookPayload.commits[0];
    c3prLOG4(`Handling webhook invoked for ${webhookPayload.repository.git_http_url}. Message: '${lastCommit.message.trim()}'.`, {lcid, sha, euuid, meta: {webhookPayload}});

    return createAndEmitChangesCommitted(webhookPayload, {lcid, sha, euuid})
        .catch(error => {
            c3prLOG4(`Error while handling webhook.`, {lcid, sha, euuid, meta: {webhookPayload}, error});
        });
}