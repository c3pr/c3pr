const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const c3prRTI = require('../invokeTool/invokeTools').c3prBrain;
const config = require('../../config');


function handleChangesCommitted({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `ChangesCommitted`,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

async function handlerFunction(changesCommittedEvent, {lcid, sha, euuid}) {
    const parent = {
        event_type: changesCommittedEvent.event_type,
        uuid: changesCommittedEvent.uuid
    };
    try {
        let result = await c3prRTI.invokeTools({
            parent, changes_committed_root: changesCommittedEvent.uuid, repository: changesCommittedEvent.payload.repository, files: changesCommittedEvent.payload.changed_files
        }, {lcid, sha, euuid});
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        c3prLOG4(`Error while invoking tools.`, {lcid, sha, euuid, error, meta: {changesCommittedEvent}});
        throw error;
    }
}

module.exports = {
    c3pr: {
        handleChangesCommitted
    }
};