
function createPatchesPayload(toolInvocation, base64GitDiff) {
    console.log(`[createPatchesPayload] called with ${JSON.stringify(toolInvocation)} --- ${base64GitDiff}`);

    return 'createPatchesPayload';
}

module.exports = createPatchesPayload;