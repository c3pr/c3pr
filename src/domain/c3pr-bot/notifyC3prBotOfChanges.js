const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    if (!changes.meta ||
        !changes.meta.correlationId ||
        !changes.meta.compatibleSchemas ||
        !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
        const errorMessage = `SKIPPING: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas): ${JSON.stringify(changes)}.`;
        console.error(errorMessage);
        return;
    }
    console.log(`[${changes.meta.correlationId}] >>> Notifying bot ${changes.changeset.length} of changes to ${changes.repository.url}...`);
    request.post(
        {url: config.c3pr.botChangesUrl, json: true, body: changes},
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`[${changes.meta.correlationId}] >>>>>> Error while notifying bot.
                * URL: ${config.c3pr.botChangesUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
            } else {
                console.log(`[${changes.meta.correlationId}] >>> Notified bot ${changes.changeset.length} of changes to ${changes.repository.url}: ${body}`);
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;