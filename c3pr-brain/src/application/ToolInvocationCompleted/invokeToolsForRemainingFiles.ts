import invokeTools from "../invokeTool/invokeTools";

export default function invokeToolsForRemainingFiles(toolInvocationCompletedEvent, c3prLOG5) {
    invokeTools({
        parentEvent: {
            event_type: toolInvocationCompletedEvent.event_type,
            uuid: toolInvocationCompletedEvent.uuid
        },
        changesCommittedRootEuuid: toolInvocationCompletedEvent.payload.changes_committed_root,
        repository: toolInvocationCompletedEvent.payload.repository
        },
        toolInvocationCompletedEvent.payload.unmodified_files,
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while invoking tools.`, {error, meta: {toolInvocationCompletedEvent}});
    });
}
