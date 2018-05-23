const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;

const logMetaz = (correlationId) => ({nodeName: 'c3pr-brain', correlationId, moduleName: 'invokeToolsForRemainingFiles'});

function invokeToolsForRemainingFiles(toolInvocationCompletedEvent, outerLogMetas) {
    c3prRTI.invokeTools({
        parent: {
            event_type: toolInvocationCompletedEvent.event_type,
            uuid: toolInvocationCompletedEvent.uuid
        },
        changes_committed_root: toolInvocationCompletedEvent.changes_committed_root,
        repository: toolInvocationCompletedEvent.payload.repository,
        files: toolInvocationCompletedEvent.payload.unmodified_files
    }).catch(e => {
        c3prLOG2({
            msg: `Error while invoking tools. Reason: '${e}'. Data: ${e.response && JSON.stringify(e.response.data) || 'no data'}.`,
            logMetas: [...(outerLogMetas || []), logMetaz(toolInvocationCompletedEvent.payload.repository.revision)],
            meta: {toolInvocationCompletedEvent, error: require('util').inspect(e)}
        });
    });
}

module.exports = invokeToolsForRemainingFiles;
