const handleChanges = require('../application/handleChanges');

module.exports = function (app) {

    app.post('/changes', function (request, response) {
        const changes = request.body;
        if (!changes.meta.correlationId || changes.meta.schemaName !== "c3pr/c3pr::changes") {
            const errorMessage = `Request does not contain required metadata (meta.correlationId and meta.schemaName): ${JSON.stringify(changes)}.`;
            console.error(errorMessage);
            response.status(400).send(errorMessage);
        }
        console.log(`>> changesController: Changes received. ${JSON.stringify(changes)}`);
        handleChanges(changes);
        response.send('Ok, that would be all, thanks.');
    });

};