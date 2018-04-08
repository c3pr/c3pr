const request = require('request');
const c3prLOG = require("node-c3pr-logger");

function sendPatchToBot(patchesUrl, patchesPayload) {
    c3prLOG(`Called with ${patchesPayload}`, {nodeName: 'c3pr-agent', correlationId: patchesPayload.meta.correlationId, moduleName: 'sendPatchToBot'});

    request.post(
        {
            url: patchesUrl,
            json: true,
            body: patchesPayload
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                c3prLOG(`Error while sending patch to bot.
                * URL: ${patchesUrl}
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n
                ${JSON.stringify(body, null, 2)}
                -----------------------\n\n`, {nodeName: 'c3pr-agent', correlationId: patchesPayload.meta.correlationId, moduleName: 'sendPatchToBot'});
            } else {
                c3prLOG(`Sent patch to bot at ${patchesUrl}.`, {nodeName: 'c3pr-agent', correlationId: patchesPayload.meta.correlationId, moduleName: 'sendPatchToBot'});
            }
        }
    );
}

module.exports = sendPatchToBot;