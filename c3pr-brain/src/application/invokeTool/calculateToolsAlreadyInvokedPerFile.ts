import eventsDB from "../events/eventsDB";

function retrieveTirsForCommit(changesCommittedRootEuuid: string) {
    return eventsDB.findAll({
        event_type: 'ToolInvocationRequested',
        'payload.changes_committed_root': changesCommittedRootEuuid
    });
}

function mapToolsAlreadyInvokedPerFile(tirsForCommit) {
    const toolsAlreadyInvokedPerFile: { [file: string]: string[] } = {};
    tirsForCommit.forEach(tir => {
        tir.payload.files.forEach(file => {
            toolsAlreadyInvokedPerFile[file] = toolsAlreadyInvokedPerFile[file] || [];
            toolsAlreadyInvokedPerFile[file].push(tir.payload.tool_id);
        })
    });
    return toolsAlreadyInvokedPerFile;
}

export default function calculateToolsAlreadyInvokedPerFile(changesCommittedRootEuuid: string) {
    return retrieveTirsForCommit(changesCommittedRootEuuid).then(mapToolsAlreadyInvokedPerFile);
}