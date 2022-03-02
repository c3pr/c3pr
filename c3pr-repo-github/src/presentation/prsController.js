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
            c3prLOG(errorMessage, {prs}, {nodeName: 'c3pr-repo-github', correlationIds: [prs.meta && prs.meta.correlationId], moduleName: 'prsController'});
            response.status(400).send(errorMessage);
            return;
        }
        c3prLOG(`pr received. Title: ${prs.patch.title} - Repo: ${prs.repository.url}`, {prs}, {nodeName: 'c3pr-repo-github', correlationId: prs.meta.correlationId, moduleName: 'prsController'});
        handlePrs(prs);
        response.send('Ok, that would be all, thanks.');
    });

};