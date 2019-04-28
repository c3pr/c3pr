const filterFilesWithExtensions = require('./filterFilesWithExtensions');
import {decideApplicableToolAgents} from "./decideApplicableToolAgents";
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;
import config from '../../config';


function invokeToolForFiles(parent, changes_committed_root, repository, tool_id, files, c3prLOG5) {
    const toolInvocationRequested = {
        parent,
        changes_committed_root,
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

/**
 * NOTE: files will be changed_files[if ChangesCommitted] or unmodified_files[if ToolInvocationCompleted]
 *
 * - Fetch all available tool agents
 * - From the files array (FUTURE: and project configuration) enumerate which tool agents are eligible
 * - Pick one tool agent
 * - Create ToolInvocationRequested for such tool agent.
 */
async function invokeTools({parentEvent, changesCommittedRootEuuid, repository, files}, c3prLOG5) {
    const applicableToolAgents = await decideApplicableToolAgents(changesCommittedRootEuuid, files, c3prLOG5);

    c3prLOG5(`Applicable tool agents: ${applicableToolAgents.length}.`, {meta: {applicableToolAgents}});

    let changedAndNotRefactoredFiles = [...files];
    let invocations = [];

    while(changedAndNotRefactoredFiles.length && applicableToolAgents.length) {
        let tool = applicableToolAgents.pop();

        /** @type {Object[]} */
        const filesForThisTool = filterFilesWithExtensions(changedAndNotRefactoredFiles, tool.extensions);

        if (filesForThisTool.length) {
            changedAndNotRefactoredFiles = changedAndNotRefactoredFiles.filter(f => !filesForThisTool.includes(f));
            invocations.push(invokeToolForFiles(parentEvent, changesCommittedRootEuuid, repository, tool.tool_id, filesForThisTool, c3prLOG5));
        }
    }

    if (!changedAndNotRefactoredFiles.length) {
        c3prLOG5(`All files have been handled. Tool invocations complete. Remaining applicable tool agents: ${applicableToolAgents.length}`);
    }
    if (!applicableToolAgents.length) {
        c3prLOG5(`All applicable TOOLS have been invoked (or all remaining files have open PRs awaiting evaluation). Tool invocations complete. Remaining changed and not refactored files: ${changedAndNotRefactoredFiles.length}`);
    }

    return Promise.all(invocations);
}

export default invokeTools;