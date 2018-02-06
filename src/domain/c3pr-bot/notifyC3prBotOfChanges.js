const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    console.log(`>>> Notifying bot ${changes.changeset.length} of changes to ${changes.repository.url}...`);
    request.post(
        {url: config.c3pr.botChangesUrl, json: true, body: changes},
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`>>>>>> Error while notifying bot.
                * URL: ${config.c3pr.botChangesUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
            } else {
                console.log(`>>> Notified bot ${changes.changeset.length} of changes to ${changes.repository.url}: ${body}`);
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;