import config from '../../config';
import retrieveFilesWithOpenPRs from "../../adapters/retrieveFilesWithOpenPRs";
import fetchProjectFiles from "../../adapters/fetchProjectFiles";
import fetchToolsNotYetInvokedForCommit from "./fetchToolsNotYetInvokedForCommit";
import {generateInvocations} from "./generateInvocations";

const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;


function invokeToolForFiles({parentEvent, changesCommittedRootEuuid, repository}, tool_id, files, c3prLOG5) {

    const toolInvocationRequested = {
        parent: parentEvent,
        changes_committed_root: changesCommittedRootEuuid,
        repository,
        tool_id,
        files
    };

    c3prLOG5(
        `Registering new event of type 'ToolInvocationRequested' for repository ${repository.clone_url_http} and rev ${repository.revision
        }. Tool id: ${tool_id}. Files: ${JSON.stringify(files)}`,
        {meta: {payload: toolInvocationRequested}}
    );

    return c3prRNE.registerNewEvent({
        ...c3prLOG5,
        event_type: `ToolInvocationRequested`,
        payload: toolInvocationRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }).catch(error => {
        c3prLOG5(`Error while registering new event: ToolInvocationRequested.`, {error});
    })
}


async function invokeTools({parentEvent, changesCommittedRootEuuid, repository}, filesChangedInThisCommit, c3prLOG5) {

    const availableToolsNotYetInvokedForThisCommit = await fetchToolsNotYetInvokedForCommit(changesCommittedRootEuuid, c3prLOG5);
    if (!availableToolsNotYetInvokedForThisCommit.length) { return []; }


    const filesWithOpenPRs = await retrieveFilesWithOpenPRs(changesCommittedRootEuuid);
    const filesChangedInThisCommitThatDontHaveOpenPRs = filesChangedInThisCommit.filter(file => !filesWithOpenPRs.includes(file));


    const projectFilesPreferences = await fetchProjectFiles(changesCommittedRootEuuid);

    const invocations = generateInvocations(filesChangedInThisCommitThatDontHaveOpenPRs, availableToolsNotYetInvokedForThisCommit, projectFilesPreferences, c3prLOG5);

    return invocations.map(({tool_id, files}) => invokeToolForFiles({parentEvent, changesCommittedRootEuuid, repository}, tool_id, files, c3prLOG5));
}

export default invokeTools;