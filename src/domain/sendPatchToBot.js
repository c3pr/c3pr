const request = require('request');
const c3prLOG = require("node-c3pr-logger");

function sendPatchToBot(patchesUrl, patchesPayload) {
    c3prLOG('c3pr-agent', [patchesPayload.meta.correlationId], 'sendPatchToBot', `called with ${patchesPayload}`);

    request.post(
        {
            url: patchesUrl,
            json: true,
            body: patchesPayload
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                c3prLOG('c3pr-agent', [patchesPayload.meta.correlationId], 'sendPatchToBot', `Error while sending patch to bot.
                * URL: ${patchesUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
            } else {
                c3prLOG('c3pr-agent', [patchesPayload.meta.correlationId], 'sendPatchToBot', `Sent patch to bot at ${patchesUrl}.`);
            }
        }
    );
}

module.exports = sendPatchToBot;