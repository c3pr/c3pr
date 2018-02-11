const request = require('request');
const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const filterApplicableToolAgents = require('./filterApplicableToolAgents');

function invokeTools(toolAgents, changes) {

    const applicableToolAgents = filterApplicableToolAgents(toolAgents, changes);

    applicableToolAgents.forEach((tool) => {

        request.post(
            {
                url: tool.agentURL,
                json: true,
                body: {
                    meta: {
                        correlationId: changes.meta.correlationId,
                        compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"]
                    },
                    repository: changes.repository,
                    files: filterFilesWithExtensions(changes.changeset, tool.extensions),
                    tool: {
                        command: tool.command,
                        toolMeta: tool.toolMeta
                    }
                }
            },
            function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    console.log(`[${changes.meta.correlationId}] [invokeTools] >>>>>> Error while invoking agent.
                * URL: ${tool.agentURL}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
                } else {
                    console.log(`[${changes.meta.correlationId}] [invokeTools] >>> Invoked agent ${tool.toolId} of changes to ${changes.repository.url}: ${JSON.stringify(tool)}`);
                }
            }
        );

    });

}

module.exports = invokeTools;