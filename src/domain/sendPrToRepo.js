const request = require('request');
const c3prLOG = require("node-c3pr-logger");

function sendPrToRepo(prsUrl, pr) {
    c3prLOG(`Sending pr to repo ${prsUrl}...`, {pr}, {nodeName: 'c3pr-brain', correlationId: pr.meta.correlationId, moduleName: 'sendPrToRepo'});

    request.post(
        {
            url: prsUrl,
            json: true,
            body: pr
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                c3prLOG(`Error while sending pr to repo.
                * URL: ${prsUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`, {nodeName: 'c3pr-brain', correlationId: pr.meta.correlationId, moduleName: 'sendPrToRepo'});
            } else {
                c3prLOG(`Sent pr to repo at ${prsUrl}.`, {nodeName: 'c3pr-brain', correlationId: pr.meta.correlationId, moduleName: 'sendPrToRepo'});
            }
        }
    );
}

module.exports = sendPrToRepo;