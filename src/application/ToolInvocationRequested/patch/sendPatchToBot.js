const axios = require('axios');
const c3prLOG = require("node-c3pr-logger");

async function sendPatchToBot(patchesUrl, patchesPayload) {
    const logMeta = {nodeName: 'c3pr-agent', correlationId: patchesPayload.meta.correlationId, moduleName: 'sendPatchToBot'};
    c3prLOG(`Called with ${patchesPayload}`, logMeta);

    try {
        await axios.post(patchesUrl, patchesPayload);
        c3prLOG(`Sent patch to bot at ${patchesUrl}.`, logMeta);
    } catch (e) {
        c3prLOG(`Error while sending patch to bot.
            * URL: ${patchesUrl}
            * Error:
            -----------------------\n
            ${require('util').inspect(e)}
            -----------------------\n\n`, logMeta);
    }
}

module.exports = sendPatchToBot;