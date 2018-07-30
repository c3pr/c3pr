const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const decideApplicableToolAgents = require('./decideApplicableToolAgents');
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;
const config = require('../../config');


function invokeToolForFiles(parent, changes_committed_root, repository, tool_id, files, {lcid, euuid}) {
    const toolInvocationRequested = {
        parent,
        changes_committed_root,
        repository,
        tool_id,
        files
    };

    c3prLOG4(
        `Registering new event of type 'ToolInvocationRequested' for repository ${repository.clone_url_http} and rev ${repository.revision
        }. Tool id: ${tool_id}. Files: ${JSON.stringify(files)}`,
        {lcid, euuid, meta: {payload: toolInvocationRequested}}
    );

    return c3prRNE.registerNewEvent({
        event_type: `ToolInvocationRequested`,
        payload: toolInvocationRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid,
        euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: ToolInvocationRequested.`, {lcid, euuid, error});
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
async function invokeTools({parent, changes_committed_root, repository, files}, {lcid, euuid}) {
    /** @type {Object[]} */
    const applicableToolAgents = await decideApplicableToolAgents(changes_committed_root, files, {lcid, euuid});

    c3prLOG4(`Applicable tool agents: ${applicableToolAgents.length}.`, {lcid, euuid, meta: {applicableToolAgents}});

    let changedAndNotRefactoredFiles = [...files];
    let invocations = [];

    while(changedAndNotRefactoredFiles.length && applicableToolAgents.length) {
        let tool = applicableToolAgents.pop();

        /** @type {Object[]} */
        const filesForThisTool = filterFilesWithExtensions(changedAndNotRefactoredFiles, tool.extensions);

        if (filesForThisTool.length) {
            changedAndNotRefactoredFiles = changedAndNotRefactoredFiles.filter(f => !filesForThisTool.includes(f));
            invocations.push(invokeToolForFiles(parent, changes_committed_root, repository, tool.tool_id, filesForThisTool, {lcid, euuid}));
        }
    }

    if (!changedAndNotRefactoredFiles.length) {
        c3prLOG4(`All files have been handled. Tool invocations complete. Remaining applicable tool agents: ${applicableToolAgents.length}`, {lcid, euuid});
    }
    if (!applicableToolAgents.length) {
        c3prLOG4(`All tool applicable agents have been invoked. Tool invocations complete. Remaining changed and not refactored files: ${changedAndNotRefactoredFiles.length}`, {lcid, euuid});
    }

    return Promise.all(invocations);
}

module.exports = {
    c3prBrain: {
        invokeTools
    }
};