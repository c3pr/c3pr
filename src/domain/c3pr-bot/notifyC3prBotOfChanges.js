const c3prLOG = require("node-c3pr-logger");
const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    if (!changes.meta ||
        !changes.meta.correlationId ||
        !changes.meta.compatibleSchemas ||
        !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
        const errorMessage = `SKIPPING: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(changes)}.`;
        c3prLOG(errorMessage, {changes}, {nodeName: 'c3pr-repo-gitlab', correlationIds: [changes.meta && changes.meta.correlationId], moduleName: 'notifyC3prBotOfChanges'});
        return;
    }

    c3prLOG(`Notifying ${config.c3pr.changesUrl} of changes to ${changes.repository.url}...`, {nodeName: 'c3pr-repo-gitlab', correlationId: changes.meta.correlationId, moduleName: 'notifyC3prBotOfChanges'});
    request.post(
        {url: config.c3pr.changesUrl, json: true, body: changes},
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                c3prLOG(`ERROR while notifying bot.
                * URL: ${config.c3pr.changesUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`, {nodeName: 'c3pr-repo-gitlab', correlationId: changes.meta.correlationId, moduleName: 'notifyC3prBotOfChanges'});
            } else {
                c3prLOG(`Notified ${config.c3pr.changesUrl} of changes to ${changes.repository.url}.`, {body}, {nodeName: 'c3pr-repo-gitlab', correlationId: changes.meta.correlationId, moduleName: 'notifyC3prBotOfChanges'});
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;