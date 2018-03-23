const log = require("node-c3pr-logger").log;

function createPatchesPayload(toolInvocation, diffBase64) {

    log.info([toolInvocation.meta.correlationId], 'createPatchesPayload', `Called with ${JSON.stringify(toolInvocation)}`, {diffBase64});

    return {
        meta: {
            correlationId: toolInvocation.meta.correlationId,
            compatibleSchemas: ["c3pr/c3pr::patches"],
            dates: toolInvocation.meta.dates.concat([{node: "c3pr-agent", date: new Date().toISOString(), "schema": "patches"}])
        },
        c3pr: {prsUrl: toolInvocation.c3pr.prsUrl},
        repository: toolInvocation.repository,
        tool: toolInvocation.tool,
        patch: {
            title: toolInvocation.tool.prTitle,
            body: toolInvocation.tool.prBody,
            diffBase64: diffBase64
        }
    };
}

module.exports = createPatchesPayload;