const request = require('request');
const filterFilesWithExtensions = require('./filterFilesWithExtensions');
const filterApplicableToolAgents = require('./filterApplicableToolAgents');
const config = require('../config');
const log = require("node-c3pr-logger").log;

function invokeTools(toolAgents, changes) {
    const applicableToolAgents = filterApplicableToolAgents(toolAgents, changes);
    log.info([changes.meta.correlationId], 'invokeTools', `Applicable tools - ${applicableToolAgents.length}: ${applicableToolAgents.map(tool => tool.toolId)}`);

    applicableToolAgents.forEach((tool) => {

        request.post(
            {
                url: tool.agentURL,
                json: true,
                body: {
                    meta: {
                        correlationId: changes.meta.correlationId,
                        compatibleSchemas: ["c3pr/c3pr-agent::toolInvocation"],
                        dates: changes.meta.dates.concat([{node: "c3pr", date: new Date().toISOString(), "schema": "toolInvocation"}])
                    },
                    c3pr: {
                        prsUrl: changes.c3pr.prsUrl,
                        patchesUrl: config.c3pr.patchesUrl
                    },
                    repository: changes.repository,
                    files: filterFilesWithExtensions(changes.changeset, tool.extensions),
                    tool: tool
                }
            },
            function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    log.info([changes.meta.correlationId], 'invokeTools', `Error while invoking agent.
                * URL: ${tool.agentURL}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
                } else {
                    log.info([changes.meta.correlationId], 'invokeTools', `Invoked agent ${tool.toolId} of changes to ${changes.repository.url}: ${JSON.stringify(tool)}`);
                }
            }
        );

    });

}

module.exports = invokeTools;