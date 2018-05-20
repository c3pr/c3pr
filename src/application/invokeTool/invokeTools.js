const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const c3prLOG = require("node-c3pr-logger");
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const decideApplicableToolAgents = require('./decideApplicableToolAgents');
const fetchAllToolAgents = require('./fetchAllToolAgents');

const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const config = require('../../config');

function invokeToolForFiles(parent, repository, tool_id, files, logMeta) {
    const toolInvocationRequested = {
        parent,
        repository,
        tool_id,
        files
    };

    const logMetas = [logMeta];

    c3prLOG2({
        msg: `Registering new event of type 'ToolInvocationRequested' for repository ${repository.clone_url_http} and rev ${repository.revision}.`,
        logMetas,
        meta: {payload: toolInvocationRequested}
    });

    c3prRNE.registerNewEvent({
        eventType: `ToolInvocationRequested`,
        payload: toolInvocationRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.jwt,
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
async function invokeTools({parent, repository, files}) {
    const logMeta = {nodeName: 'c3pr-brain', moduleName: 'invokeTools'};

    const availableAgents = await fetchAllToolAgents();

    /** @type {Object[]} */
    const applicableToolAgents = decideApplicableToolAgents(availableAgents, files);

    c3prLOG(`Applicable tools - ${applicableToolAgents.length}: ${JSON.stringify(applicableToolAgents.map(tool => tool.tool_id))}`, logMeta);

    let changedAndNotRefactoredFiles = [...files];

    while(changedAndNotRefactoredFiles.length && applicableToolAgents.length) {
        let tool = applicableToolAgents.pop();

        /** @type {Object[]} */
        const filesForThisTool = filterFilesWithExtensions(changedAndNotRefactoredFiles, tool.extensions);

        if (filesForThisTool.length) {
            changedAndNotRefactoredFiles = changedAndNotRefactoredFiles.filter(f => !filesForThisTool.includes(f));
            invokeToolForFiles(parent, repository, tool.tool_id, filesForThisTool, logMeta);
        }
    }
}

module.exports = {
    c3prBrain: {
        invokeTools
    }
};