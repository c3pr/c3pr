const request = require('request');
const toolAgents = require('./toolAgents');
const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');

function invokeTools(pushedChange) {

    const extensionsInChangeset = extractExtensionsInChangeset(pushedChange.changeset);

    extensionsInChangeset.forEach((extension) => {
        const applicableToolAgents = toolAgents.agents.filter(toolAgent => toolAgent.extensions.includes(extension));

        applicableToolAgents.forEach((tool) => {

            request.post(tool.agentURL,
                {
                    repository: pushedChange.repository,
                    files: filterFilesWithExtensions(pushedChange.changeset, tool.extensions),
                    arguments: tool.arguments

                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(body)
                    }
                }
            );

        })
    });

}

module.exports = invokeTools;