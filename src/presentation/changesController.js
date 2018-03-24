const handleChanges = require('../application/handleChanges');
const log = require("node-c3pr-logger").log;

module.exports = function (app) {

    app.post('/changes', function (request, response) {
        const changes = request.body;
        if (!changes.meta ||
            !changes.meta.correlationId ||
            !changes.meta.compatibleSchemas ||
            !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(changes)}.`;
            log.info([changes.meta.correlationId], 'changesController', errorMessage, {changes});
            response.status(400).send(errorMessage);
            return;
        }
        log.info([changes.meta.correlationId], 'changesController', `Changes received. ${JSON.stringify(changes)}`);
        handleChanges(changes);
        response.send('Ok, that would be all, thanks.');
    });

};