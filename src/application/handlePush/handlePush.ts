import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";

import { createAndEmitChangesCommitted } from '../ChangesCommitted/createAndEmitChangesCommitted';
import {sortCommits} from "../gitlab/sortCommits";

export default function handlePush(webhookPayload) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handlePush'}];

    const lastCommit = sortCommits(webhookPayload.commits).pop();
    c3prLOG2({
        msg: `Handling webhook invoked for ${webhookPayload.repository.git_http_url}. Message: '${lastCommit.message.trim()}'.`,
        logMetas,
        meta: {webhookPayload}
    });

    createAndEmitChangesCommitted(webhookPayload)
        .catch(e => {
            c3prLOG2({
                msg: `Error while handling webhook. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}.`,
                logMetas,
                meta: {webhookPayload, error: require('util').inspect(e)}
            });
        })
}