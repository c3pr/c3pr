const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    if (!changes.meta ||
        !changes.meta.correlationId ||
        !changes.meta.compatibleSchemas ||
        !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
        const errorMessage = `[notifyC3prBotOfChanges] SKIPPING: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(changes)}.`;
        console.error(errorMessage);
        return;
    }

    const prefix = `[${changes.meta.correlationId}] [notifyC3prBotOfChanges]`;
    console.log(`${prefix} Notifying ${config.c3pr.changesUrl} of changes to ${changes.repository.url}...`);
    request.post(
        {url: config.c3pr.changesUrl, json: true, body: changes},
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`${prefix} Error while notifying bot.
                * URL: ${config.c3pr.changesUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
            } else {
                console.log(`${prefix} Notified ${config.c3pr.changesUrl} of changes to ${changes.repository.url}: ${JSON.stringify(body)}`);
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;