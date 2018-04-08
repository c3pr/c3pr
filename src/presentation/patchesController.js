const handlePatches = require('../application/handlePatches');
const c3prLOG = require("node-c3pr-logger");

module.exports = function (app) {

    app.post('/patches', function (request, response) {
        const patches = request.body;
        if (!patches.meta ||
            !patches.meta.correlationId ||
            !patches.meta.compatibleSchemas ||
            !patches.meta.compatibleSchemas.includes("c3pr/c3pr::patches")) {
            const errorMessage = `ERROR: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas). meta: ${JSON.stringify(patches.meta)}.`;
            c3prLOG(errorMessage, {patches}, {nodeName: 'c3pr', correlationIds: [patches.meta && patches.meta.correlationId], moduleName: 'patchesController'});
            response.status(400).send(errorMessage);
            return;
        }
        c3prLOG(`Patches received. Tool: ${patches.tool.toolId}; Title: ${patches.patch.title}`, {patches}, {nodeName: 'c3pr', correlationId: patches.meta.correlationId, moduleName: 'patchesController'});
        handlePatches(patches);
        response.send('Ok, that would be all, thanks.');
    });

};