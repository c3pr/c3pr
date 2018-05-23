const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const createPullRequestRequested = require('../PullRequestRequested/createPullRequestRequested').c3pr.createPullRequestRequested;
const emitPullRequestRequested = require('../PullRequestRequested/emitPullRequestRequested');

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;

const logMetaz = (correlationId) => [{nodeName: 'c3pr-brain', correlationId, moduleName: 'createAndEmitPullRequestRequested'}];

function invokeToolsForRemainingFiles(toolInvocationCompleted) {
    c3prRTI.invokeTools({
        parent: {
            event_type: toolInvocationCompleted.event_type,
            uuid: toolInvocationCompleted.uuid
        },
        changes_committed_root: toolInvocationCompleted.changes_committed_root,
        repository: toolInvocationCompleted.repository,
        files: toolInvocationCompleted.unmodified_files
    }).catch(e => {
        c3prLOG2({
            msg: `Error while invoking tools. Reason: '${e}'. Data: ${e.response && e.response.data}.`,
            logMetas: logMetaz(toolInvocationCompleted.repository.revision),
            meta: {toolInvocationCompleted, error: require('util').inspect(e)}
        });
    });
}

function createAndEmitPullRequestRequested(toolInvocationCompleted, logMetas) {
    if (toolInvocationCompleted.unmodified_files.length) {
        invokeToolsForRemainingFiles(toolInvocationCompleted);
    }

    const pullRequestRequested = createPullRequestRequested(toolInvocationCompleted);
    emitPullRequestRequested(pullRequestRequested, logMetas);
}

module.exports = createAndEmitPullRequestRequested;
