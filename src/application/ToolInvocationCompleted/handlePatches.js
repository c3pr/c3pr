const createPrsFromPatches = require('./createPrsFromPatches');
const sendPrToRepo = require('./sendPrToRepo');
const c3prLOG = require("node-c3pr-logger");

function handlePatches(patches) {
    c3prLOG(`Handling patches invoked for ${JSON.stringify(patches)}...`, {nodeName: 'c3pr-brain', correlationId: patches.meta.correlationId, moduleName: 'handlePatches'});

    const prs = createPrsFromPatches(patches);

    sendPrToRepo(patches.c3pr.prsUrl, prs);
}

module.exports = handlePatches;