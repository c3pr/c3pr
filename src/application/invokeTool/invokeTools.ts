import config from '../../config';
import {generateInvocations} from "./generateInvocations";
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';
import {ProjectPreferences} from "../preferences/ProjectPreferences";
import generateProjectPreferences from "../preferences/generateProjectPreferences";
import fetchAllToolAgents from "./fetchAllToolAgents";
import calculateToolsAlreadyInvokedPerFile from "./calculateToolsAlreadyInvokedPerFile";


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

export default async function invokeTools({parentEvent, changesCommittedRootEuuid, repository}, filesChangedInThisCommit, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'invokeTools'});

    const projectPreferences: ProjectPreferences = await generateProjectPreferences(repository.clone_url_http);
    const availableToolAgents = await fetchAllToolAgents();
    const toolsAlreadyInvokedPerFile = await calculateToolsAlreadyInvokedPerFile(changesCommittedRootEuuid);

    const invocations = generateInvocations(projectPreferences, filesChangedInThisCommit, availableToolAgents, toolsAlreadyInvokedPerFile, c3prLOG5);

    return invocations.map(({tool_id, files}) => invokeToolForFiles({parentEvent, changesCommittedRootEuuid, repository}, tool_id, files, c3prLOG5));
}