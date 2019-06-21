import config from '../../config';
import retrieveFilesWithOpenPRs from "../../adapters/retrieveFilesWithOpenPRs";
import fetchProjectFiles from "../../adapters/fetchProjectFiles";
import fetchToolsNotYetInvokedForCommit from "./fetchToolsNotYetInvokedForCommit";
import {generateInvocations} from "./generateInvocations";
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';
import {prioritizeToolsForCommit} from "./prioritizeToolsForCommit";


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

    return c3prHubRegisterNewEvent(
        {
            event_type: `ToolInvocationRequested`,
            payload: toolInvocationRequested,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: ToolInvocationRequested.`, {error});
    });
}


async function filterFilesChangedInThisCommitThatDontHaveOpenPRs(changesCommittedRootEuuid: any, filesChangedInThisCommit) {
    const filesWithOpenPRs = await retrieveFilesWithOpenPRs(changesCommittedRootEuuid);
    return filesChangedInThisCommit.filter(file => !filesWithOpenPRs.includes(file));
}


async function invokeTools({parentEvent, changesCommittedRootEuuid, repository}, filesChangedInThisCommit, c3prLOG5) {

    const availableToolsNotYetInvokedForThisCommit = await fetchToolsNotYetInvokedForCommit(changesCommittedRootEuuid, c3prLOG5);
    if (!availableToolsNotYetInvokedForThisCommit.length) { return []; }

    const prioritizedNotYetInvokedTools = await prioritizeToolsForCommit(changesCommittedRootEuuid, availableToolsNotYetInvokedForThisCommit);


    const filesChangedInThisCommitThatDontHaveOpenPRs = await filterFilesChangedInThisCommitThatDontHaveOpenPRs(changesCommittedRootEuuid, filesChangedInThisCommit);
    if (!filesChangedInThisCommitThatDontHaveOpenPRs.length) {
        c3prLOG5(`All files in this commit have pending c3pr PRs. Skipping.`);
        return [];
    }


    const projectFilesPreferences = await fetchProjectFiles(changesCommittedRootEuuid);

    const invocations = generateInvocations(filesChangedInThisCommitThatDontHaveOpenPRs, prioritizedNotYetInvokedTools, projectFilesPreferences, c3prLOG5);

    return invocations.map(({tool_id, files}) => invokeToolForFiles({parentEvent, changesCommittedRootEuuid, repository}, tool_id, files, c3prLOG5));
}

export default invokeTools;