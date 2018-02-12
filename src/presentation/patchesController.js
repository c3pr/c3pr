const handlePatches = require('../application/handlePatches');

module.exports = function (app) {

    app.post('/patches', function (request, response) {
        const patches = request.body;
        if (!patches.meta ||
            !patches.meta.correlationId ||
            !patches.meta.compatibleSchemas ||
            !patches.meta.compatibleSchemas.includes("c3pr/c3pr::patches")) {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(patches)}.`;
            console.error(errorMessage);
            response.status(400).send(errorMessage);
            return;
        }
        console.log(`[${patches.meta.correlationId}] >> patchesController: patches received. ${JSON.stringify(patches)}`);
        handlePatches(patches);
        response.send('Ok, that would be all, thanks.');
    });

};