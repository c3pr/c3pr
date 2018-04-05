const c3prLOG = require("node-c3pr-logger");
const handlePrs = require('../application/handlePrs');

module.exports = function (app) {

    app.post('/prs', function (request, response) {
        const prs = request.body;
        if (!prs.meta ||
            !prs.meta.correlationId ||
            !prs.meta.compatibleSchemas ||
            !prs.meta.compatibleSchemas.includes("c3pr/c3pr::prs")) {
            const errorMessage = `ERROR Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(prs)}.`;
            c3prLOG('c3pr-repo-github', [prs.meta && prs.meta.correlationId], 'prsController', errorMessage, {prs});
            response.status(400).send(errorMessage);
            return;
        }
        c3prLOG('c3pr-repo-github', [prs.meta.correlationId], 'prsController', `pr received. ${JSON.stringify(prs)}`);
        handlePrs(prs);
        response.send('Ok, that would be all, thanks.');
    });

};