const request = require('request');
const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');

function invokeTools(toolAgents, changes) {

    const extensionsInChangeset = extractExtensionsInChangeset(changes.changeset);

    extensionsInChangeset.forEach((extension) => {
        const applicableToolAgents = toolAgents.agents.filter(toolAgent => toolAgent.extensions.includes(extension));

        applicableToolAgents.forEach((tool) => {

            request.post(
                {
                    url: tool.agentURL,
                    json: true,
                    body: {
                        meta: {
                            correlationId: changes.meta.correlationId,
                            schemas: {
                                "c3pr/c3pr-agent::toolInvocation": true
                            }
                        },
                        repository: changes.repository,
                        files: filterFilesWithExtensions(changes.changeset, tool.extensions),
                        arguments: tool.arguments
                    }
                },
                function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                        console.log(`[${changes.meta.correlationId}] >>>>>> Error while invoking agent.
                * URL: ${tool.agentURL}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
                    } else {
                        console.log(`[${changes.meta.correlationId}] >>> Invoked agent ${tool.name} of changes to ${changes.repository.url}: ${JSON.stringify(tool.arguments)}`);
                    }
                }
            );

        })
    });

}

module.exports = invokeTools;