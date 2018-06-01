const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').handleFirstCollectedEvent.handleFirstCollectedEvent;

const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;

const config = require('../../config');

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'handleChangesCommitted'}];

function handleChangesCommitted() {
    return handleFirstCollectedEvent({
        event_type: `ChangesCommitted`,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    });
}

async function handlerFunction(changesCommittedEvent) {
    const parent = {
        event_type: changesCommittedEvent.event_type,
        uuid: changesCommittedEvent.uuid
    };
    try {
        let result = await c3prRTI.invokeTools({
            parent, changes_committed_root: changesCommittedEvent.uuid, repository: changesCommittedEvent.payload.repository, files: changesCommittedEvent.payload.changed_files
        });
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        c3prLOG2({msg: `Error while invoking tools.`, logMetas, error, meta: {changesCommittedEvent}});
        throw error;
    }
}

module.exports = {
    c3pr: {
        handleChangesCommitted
    }
};