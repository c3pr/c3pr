const handlePrs = require('../application/handlePrs');

module.exports = function (app) {

    app.post('/prs', function (request, response) {
        const prs = request.body;
        if (!prs.meta ||
            !prs.meta.correlationId ||
            !prs.meta.compatibleSchemas ||
            !prs.meta.compatibleSchemas.includes("c3pr/c3pr::prs")) {
            const errorMessage = `[prsController] Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(prs)}.`;
            console.error(errorMessage);
            response.status(400).send(errorMessage);
            return;
        }
        console.log(`[${prs.meta.correlationId}] [prsController]: pr received. ${JSON.stringify(prs)}`);
        handlePrs(prs);
        response.send('Ok, that would be all, thanks.');
    });

};