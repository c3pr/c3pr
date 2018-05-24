const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const decideApplicableToolAgents = require('./decideApplicableToolAgents');

const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const config = require('../../config');

const logMetaz = (correlationId) => [{nodeName: 'c3pr-brain', correlationId, moduleName: 'invokeTools'}];

function invokeToolForFiles(parent, changes_committed_root, repository, tool_id, files) {
    const logMetas = logMetaz(repository.revision);
    const toolInvocationRequested = {
        parent,
        changes_committed_root,
        repository,
        tool_id,
        files
    };

    c3prLOG2({
        msg: `Registering new event of type 'ToolInvocationRequested' for repository ${repository.clone_url_http} and rev ${repository.revision}.`,
        logMetas,
        meta: {payload: toolInvocationRequested}
    });

    return c3prRNE.registerNewEvent({
        event_type: `ToolInvocationRequested`,
        payload: toolInvocationRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    })
    .catch(e => {
        c3prLOG2({
            msg: `Error while registering new event: ToolInvocationRequested. Reason: '${e}'. Data: ${e.response.data}.`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
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
async function invokeTools({parent, changes_committed_root, repository, files}) {
    const logMetas = logMetaz(repository.revision);

    /** @type {Object[]} */
    const applicableToolAgents = await decideApplicableToolAgents(changes_committed_root, files, logMetas);

    c3prLOG2({
        msg: `Applicable tools agents ${applicableToolAgents.length}: ${JSON.stringify(applicableToolAgents.map(tool => tool.tool_id))}`,
        meta: {applicableToolAgents},
        logMetas
    });

    let changedAndNotRefactoredFiles = [...files];
    let invocations = [];

    while(changedAndNotRefactoredFiles.length && applicableToolAgents.length) {
        let tool = applicableToolAgents.pop();

        /** @type {Object[]} */
        const filesForThisTool = filterFilesWithExtensions(changedAndNotRefactoredFiles, tool.extensions);

        if (filesForThisTool.length) {
            changedAndNotRefactoredFiles = changedAndNotRefactoredFiles.filter(f => !filesForThisTool.includes(f));
            invocations.push(invokeToolForFiles(parent, changes_committed_root, repository, tool.tool_id, filesForThisTool));
        }
    }

    if (!changedAndNotRefactoredFiles.length) {
        c3prLOG2({msg: `All files have been handled. Tool invocations complete. Remaining applicable tool agents: ${applicableToolAgents.length}`, logMetas});
    }
    if (!applicableToolAgents.length) {
        c3prLOG2({msg: `All tool applicable agents have been invoked. Tool invocations complete. Remaining changed and not refactored files: ${changedAndNotRefactoredFiles.length}`, logMetas});
    }

    return Promise.all(invocations);
}

module.exports = {
    c3prBrain: {
        invokeTools
    }
};