const handleChanges = require('../application/handleChanges');

module.exports = function (app) {

    app.post('/patches', function (request, response) {
        const patches = request.body;
        if (!patches.meta.correlationId || patches.meta.schemaName !== "c3pr/c3pr::patches") {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.schemaName): ${JSON.stringify(patches)}.`;
            console.error(errorMessage);
            response.status(400).send(errorMessage);
            return;
        }
        console.log(`[${patches.meta.correlationId}] >> patchesController: patches received. ${JSON.stringify(patches)}`);
        handleChanges(patches);
        response.send('Ok, that would be all, thanks.');
    });

};