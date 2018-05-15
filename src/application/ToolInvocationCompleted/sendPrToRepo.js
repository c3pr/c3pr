const axios = require('axios');
const c3prLOG = require("node-c3pr-logger");

async function sendPrToRepo(prsUrl, pr) {
    const logMeta = {nodeName: 'c3pr-brain', correlationId: pr.meta.correlationId, moduleName: 'sendPrToRepo'};
    c3prLOG(`Sending pr to repo ${prsUrl}...`, {pr}, logMeta);

    try {
        await axios.post(prsUrl, pr);
        c3prLOG(`Sent pr to repo at ${prsUrl}.`, logMeta);
    } catch (e) {
        c3prLOG(`Error while sending pr to repo.
                * URL: ${prsUrl}
                * Error:
                -----------------------\n
                ${require('util').inspect(e)}
                -----------------------\n\n`, logMeta);
    }
}

module.exports = sendPrToRepo;