const createPrsFromPatches = require('../domain/createPrsFromPatches');
const sendPrToRepo = require('../domain/sendPrToRepo');
const c3prLOG = require("node-c3pr-logger");

function handlePatches(patches) {
    c3prLOG('c3pr', [patches.meta.correlationId], 'handlePatches', `Handling patches invoked for ${JSON.stringify(patches)}...`);

    const prs = createPrsFromPatches(patches);

    sendPrToRepo(patches.c3pr.prsUrl, prs);
}

module.exports = handlePatches;