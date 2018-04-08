const handleToolInvocation = require('../application/handleToolInvocation');
const c3prLOG = require("node-c3pr-logger");

module.exports = function (app) {

    app.post('/c3pr', function(request, response){
        const toolInvocation = request.body;
        if (!toolInvocation.meta ||
            !toolInvocation.meta.correlationId ||
            !toolInvocation.meta.compatibleSchemas ||
            !toolInvocation.meta.compatibleSchemas.includes("c3pr/c3pr-agent::toolInvocation")) {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(toolInvocation)}.`;
            c3prLOG(errorMessage, {toolInvocation}, {nodeName: 'c3pr-agent', correlationIds: [toolInvocation.meta && toolInvocation.meta.correlationId], moduleName: 'c3prController'});
            response.status(400).send(errorMessage);
            return;
        }
        c3prLOG(`toolInvocation received.`, {toolInvocation}, {nodeName: 'c3pr-agent', correlationIds: toolInvocation.meta.correlationId, moduleName: 'c3prController'});
        handleToolInvocation(toolInvocation);

        // echo back request
        response.send(toolInvocation);
    });

};