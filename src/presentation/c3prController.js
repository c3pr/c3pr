const handleToolInvocation = require('../application/handleToolInvocation');
const c3prLOG = require("node-c3pr-logger");

module.exports = function (app) {

    app.post('/c3pr', function(request, response){
        const toolInvocation = request.body;
        const logMeta = {nodeName: 'c3pr-agent', correlationIds: [toolInvocation.meta && toolInvocation.meta.correlationId], moduleName: 'c3prController'};

        if (!toolInvocation.meta ||
            !toolInvocation.meta.correlationId ||
            !toolInvocation.meta.compatibleSchemas ||
            !toolInvocation.meta.compatibleSchemas.includes("c3pr/c3pr-agent::toolInvocation")) {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(toolInvocation)}.`;
            c3prLOG(errorMessage, {toolInvocation}, logMeta);
            response.status(400).send(errorMessage);
            return;
        }
        c3prLOG(`toolInvocation received.`, {toolInvocation}, logMeta);
        handleToolInvocation(toolInvocation).then(aPatchHasBeenGenerated => {
            if (aPatchHasBeenGenerated) {
                response.status(200).send('This tool diff ended successfully and generated a diff.');
            } else {
                response.status(204).send('This tool diff ended successfully and did NOT generate a diff.');
            }
        });
    });

};