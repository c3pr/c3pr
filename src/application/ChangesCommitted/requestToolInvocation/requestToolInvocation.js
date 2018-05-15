const invokeTools = require('./invokeTools');

/**
 * - Fetch all available tool agents
 * - From the changed_files[if ChangesCommitted] |unmodified_files[if ToolInvocationCompleted] (FUTURE: and project configuration) enumerate which tool agents are eligible
 * - Pick one tool agent
 * - Create ToolInvocationRequested for such tool agent.
 *
 * @param changesCommitted
 */
function requestToolInvocation({repository, files}) {
    invokeTools({repository, files});
}

module.exports = {
    c3pr: {
        requestToolInvocation
    }
};