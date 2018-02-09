const handleToolInvocation = require('../application/handleToolInvocation');

module.exports = function (app) {

    app.post('/c3pr', function(request, response){
        const toolInvocation = request.body;
        if (!toolInvocation.meta ||
            !toolInvocation.meta.correlationId ||
            !toolInvocation.meta.compatibleSchemas ||
            !toolInvocation.meta.compatibleSchemas.includes("c3pr/c3pr-agent::toolInvocation")) {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(toolInvocation)}.`;
            console.error(errorMessage);
            response.status(400).send(errorMessage);
            return;
        }
        console.log(`[${toolInvocation.meta.correlationId}] >> c3prController: toolInvocation received. ${JSON.stringify(toolInvocation)}`);
        handleToolInvocation(toolInvocation);

        // echo back request
        response.send(toolInvocation);
    });

};