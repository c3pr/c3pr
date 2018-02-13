const request = require('request');

function sendPatchToBot(patchesUrl, patchesPayload) {
    console.log(`[sendPatchToBot] called with ${patchesPayload}`);

    request.post(
        {
            url: patchesUrl,
            json: true,
            body: patchesPayload
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`[${patchesPayload.meta.correlationId}] [sendPatchToBot] >>>>>> Error while sending patch to bot.
                * URL: ${patchesUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`);
            } else {
                console.log(`[${patchesPayload.meta.correlationId}] [sendPatchToBot] >>> Sent patch to bot at ${patchesUrl}.`);
            }
        }
    );
}

module.exports = sendPatchToBot;