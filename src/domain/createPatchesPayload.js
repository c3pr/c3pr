
function createPatchesPayload(toolInvocation, base64GitDiff) {

    console.log(`[createPatchesPayload] called with ${JSON.stringify(toolInvocation)} --- ${base64GitDiff}`);

    return {
        meta: {
            correlationId: toolInvocation.meta.correlationId,
            compatibleSchemas: ["c3pr/c3pr::patches"],
            dates: toolInvocation.meta.dates.concat([{node: "c3pr-agent", date: new Date().toISOString(), "schema": "patches"}])
        },
        c3pr: {prUrl: toolInvocation.c3pr.prUrl},
        repository: toolInvocation.repository,
        tool: toolInvocation.tool,
        patch: {
            title: toolInvocation.tool.prTitle,
            body: toolInvocation.tool.prBody,
            base64Diff: base64GitDiff
        }
    };
}

module.exports = createPatchesPayload;