const log = require("node-c3pr-logger").log;
const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    if (!changes.meta ||
        !changes.meta.correlationId ||
        !changes.meta.compatibleSchemas ||
        !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
        const errorMessage = `SKIPPING: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(changes)}.`;
        log.info([changes.meta && changes.meta.correlationId], 'notifyC3prBotOfChanges', errorMessage, {changes});
        return;
    }

    log.info([changes.meta.correlationId], 'notifyC3prBotOfChanges', `Notifying ${config.c3pr.changesUrl} of changes to ${changes.repository.url}...`);
    request.post(
        {url: config.c3pr.changesUrl, json: true, body: changes},
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                log.info([changes.meta.correlationId], 'notifyC3prBotOfChanges', `ERROR while notifying bot.
                * URL: ${config.c3pr.changesUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
            } else {
                log.info([changes.meta.correlationId], 'notifyC3prBotOfChanges', `Notified ${config.c3pr.changesUrl} of changes to ${changes.repository.url}.`, {body});
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;