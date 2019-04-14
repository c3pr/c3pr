import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;


function invokeToolsForRemainingFiles(toolInvocationCompletedEvent, {lcid, sha, euuid}) {
    c3prRTI.invokeTools({
        parent: {
            event_type: toolInvocationCompletedEvent.event_type,
            uuid: toolInvocationCompletedEvent.uuid
        },
        changes_committed_root: toolInvocationCompletedEvent.payload.changes_committed_root,
        repository: toolInvocationCompletedEvent.payload.repository,
        files: toolInvocationCompletedEvent.payload.unmodified_files
    }, {lcid, sha, euuid}).catch(error => {
        c3prLOG4(`Error while invoking tools.`, {lcid, sha, euuid, error, meta: {toolInvocationCompletedEvent}});
    });
}

export = invokeToolsForRemainingFiles;
