const createPrsFromPatches = require('../domain/createPrsFromPatches');
const sendPrToRepo = require('../domain/sendPrToRepo');

function handlePatches(patches) {
    console.log(`[${patches.meta.correlationId}] [handlePatches] Handling patches invoked for ${JSON.stringify(patches)}...`);

    const prs = createPrsFromPatches(patches);

    sendPrToRepo(patches.c3pr.prUrl, prs);
}

module.exports = handlePatches;