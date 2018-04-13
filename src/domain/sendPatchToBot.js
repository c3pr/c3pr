const axios = require('axios');
const c3prLOG = require("node-c3pr-logger");

function sendPatchToBot(patchesUrl, patchesPayload) {
    const logMeta = {nodeName: 'c3pr-agent', correlationId: patchesPayload.meta.correlationId, moduleName: 'sendPatchToBot'};
    c3prLOG(`Called with ${patchesPayload}`, logMeta);

    axios.post(patchesUrl, patchesPayload)
        .then(() => {
            c3prLOG(`Sent patch to bot at ${patchesUrl}.`, logMeta);
        }).catch(function (...error) {
            c3prLOG(`Error while sending patch to bot.
            * URL: ${patchesUrl}
            * Error:
            -----------------------\n
            ${JSON.stringify({...error}, null, 2)}
            -----------------------\n\n`, logMeta);
        });
}

module.exports = sendPatchToBot;