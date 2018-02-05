const request = require('request');
const config = require('../../config');

function notifyC3prBotOfChanges(changes) {
    console.log(`>>> Notifying bot ${changes.changeset.length} of changes to ${changes.repository.url}...`);
    request.post(config.c3pr.botChangesUrl,
        changes,
        function (error, response, body) {
            console.log(`>>> Notified bot ${changes.changeset.length} of changes to ${changes.repository.url}.`);
            if (!error && response.statusCode === 200) {
                console.log(body)
            }
        }
    );
}

module.exports = notifyC3prBotOfChanges;