const handleToolInvocation = require('./handleToolInvocation');
const c3prLOG = require("node-c3pr-logger");

function handleToolInvocationRequested() {

}

module.exports = {
    handleToolInvocationRequested: {
        handleToolInvocationRequested
    }
};


function old(app) {

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
        handleToolInvocation(toolInvocation).then(toolInvocationResult => {
            if (toolInvocationResult.files.length) {
                response.status(200).send({files: toolInvocationResult.files, description: 'This tool invocation completed successfully and has generated a diff.'});
            } else {
                response.status(204).send({files: toolInvocationResult.files, description: 'This tool invocation completed successfully and has NOT generated a diff.'});
            }
        });
    });

}