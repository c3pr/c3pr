const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const createPullRequestRequested = require('../PullRequestRequested/createPullRequestRequested').c3pr.createPullRequestRequested;
const emitPullRequestRequested = require('../PullRequestRequested/emitPullRequestRequested');

const invokeToolsForRemainingFiles = require('./invokeToolsForRemainingFiles');

function createAndEmitPullRequestRequested(toolInvocationCompletedEvent, logMetas) {
    const lms = [...(logMetas || []), {nodeName: 'c3pr-brain', correlationId: toolInvocationCompletedEvent.payload.repository.revision, moduleName: 'createAndEmitPullRequestRequested'}];

    if (toolInvocationCompletedEvent.payload.unmodified_files.length) {
        c3prLOG2({
            msg: `ToolInvocationCompleted has unmodified files. I will now attempt to invoke new tools.`,
            logMetas: lms,
            meta: {toolInvocationCompletedEvent}
        });
        invokeToolsForRemainingFiles(toolInvocationCompletedEvent, lms);
    }

    if (toolInvocationCompletedEvent.payload.changed_files.length) {
        c3prLOG2({
            msg: `ToolInvocationCompleted modified files. I will now issue a PullRequestRequested event.`,
            logMetas: lms,
            meta: {toolInvocationCompletedEvent}
        });
        const pullRequestRequested = createPullRequestRequested(toolInvocationCompletedEvent);
        emitPullRequestRequested(pullRequestRequested, lms);
    }
}

module.exports = createAndEmitPullRequestRequested;
