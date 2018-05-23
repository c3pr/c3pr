const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const sortCommits = require('../gitlab/sortCommits');

const createAndEmitChangesCommitted = require('../ChangesCommitted/createAndEmitChangesCommitted');

function handleWebhook(webhookPayload) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', correlationId: webhookPayload.after, moduleName: 'handleWebhook'}];

    // noinspection JSUnresolvedFunction
    const lastCommit = sortCommits(webhookPayload.commits).pop();
    c3prLOG2({
        msg: `Handling webhook invoked for ${webhookPayload.repository.url}. Message: '${lastCommit.message.trim()}'.`,
        logMetas,
        meta: {webhookPayload}
    });

    createAndEmitChangesCommitted(webhookPayload);
}

module.exports = {
    c3pr: {
        handleWebhook
    }
};