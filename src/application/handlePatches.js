const createPrsFromPatches = require('../domain/createPrsFromPatches');
const sendPrToRepo = require('../domain/sendPrToRepo');
const log = require("node-c3pr-logger").log;

function handlePatches(patches) {
    log.info([patches.meta.correlationId], 'handlePatches', `Handling patches invoked for ${JSON.stringify(patches)}...`);

    const prs = createPrsFromPatches(patches);

    sendPrToRepo(patches.c3pr.prsUrl, prs);
}

module.exports = handlePatches;