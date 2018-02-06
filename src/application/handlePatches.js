
function handlePatches(patches) {
    console.log(`[${patches.meta.correlationId}] >>> Handling patches invoked for ${JSON.stringify(patches)}...`);
}

module.exports = handlePatches;