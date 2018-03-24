const request = require('request');
const log = require("node-c3pr-logger").log;

function sendPrToRepo(prsUrl, pr) {
    log.info([pr.meta.correlationId], 'sendPrToRepo', `Sending pr to repo ${prsUrl}...`, {pr});

    request.post(
        {
            url: prsUrl,
            json: true,
            body: pr
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                log.info([pr.meta.correlationId], 'sendPrToRepo', `Error while sending pr to repo.
                * URL: ${prsUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
            } else {
                log.info([pr.meta.correlationId], 'sendPrToRepo', `Sent pr to repo at ${prsUrl}.`);
            }
        }
    );
}

module.exports = sendPrToRepo;