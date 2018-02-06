const request = require('request');
const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');

function invokeTools(toolAgents, pushedChange) {

    const extensionsInChangeset = extractExtensionsInChangeset(pushedChange.changeset);

    extensionsInChangeset.forEach((extension) => {
        const applicableToolAgents = toolAgents.agents.filter(toolAgent => toolAgent.extensions.includes(extension));

        applicableToolAgents.forEach((tool) => {

            request.post(
                {
                    url: tool.agentURL,
                    json: true,
                    body: {
                        repository: pushedChange.repository,
                        files: filterFilesWithExtensions(pushedChange.changeset, tool.extensions),
                        arguments: tool.arguments
                    }
                },
                function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                        console.log(`>>>>>> Error while invoking agent.
                * URL: ${tool.agentURL}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
                    } else {
                        console.log(`>>> Invoked agent ${tool.name} of changes to ${pushedChange.repository}: ${body}`);
                    }
                }
            );

        })
    });

}

module.exports = invokeTools;