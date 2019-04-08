const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const decideApplicableToolAgents = require('./decideApplicableToolAgents');
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;
const config = require('../../config');


function invokeToolForFiles(parent, changes_committed_root, repository, tool_id, files, {lcid, sha, euuid}) {
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
        {lcid, sha, euuid, meta: {payload: toolInvocationRequested}}
    );

    return c3prRNE.registerNewEvent({
        event_type: `ToolInvocationRequested`,
        payload: toolInvocationRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: ToolInvocationRequested.`, {lcid, sha, euuid, error});
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
async function invokeTools({parent, changes_committed_root, repository, files}, {lcid, sha, euuid}) {
    /** @type {Object[]} */
    const applicableToolAgents = await decideApplicableToolAgents(changes_committed_root, files, {lcid, sha, euuid});

    c3prLOG4(`Applicable tool agents: ${applicableToolAgents.length}.`, {lcid, sha, euuid, meta: {applicableToolAgents}});

    let changedAndNotRefactoredFiles = [...files];
    let invocations = [];

    while(changedAndNotRefactoredFiles.length && applicableToolAgents.length) {
        let tool = applicableToolAgents.pop();

        /** @type {Object[]} */
        const filesForThisTool = filterFilesWithExtensions(changedAndNotRefactoredFiles, tool.extensions);

        if (filesForThisTool.length) {
            changedAndNotRefactoredFiles = changedAndNotRefactoredFiles.filter(f => !filesForThisTool.includes(f));
            invocations.push(invokeToolForFiles(parent, changes_committed_root, repository, tool.tool_id, filesForThisTool, {lcid, sha, euuid}));
        }
    }

    if (!changedAndNotRefactoredFiles.length) {
        c3prLOG4(`All files have been handled. Tool invocations complete. Remaining applicable tool agents: ${applicableToolAgents.length}`, {lcid, sha, euuid});
    }
    if (!applicableToolAgents.length) {
        c3prLOG4(`All applicable TOOLS have been invoked (or all remaining files have open PRs awaiting evaluation). Tool invocations complete. Remaining changed and not refactored files: ${changedAndNotRefactoredFiles.length}`, {lcid, sha, euuid});
    }

    return Promise.all(invocations);
}

module.exports = {
    c3prBrain: {
        invokeTools
    }
};