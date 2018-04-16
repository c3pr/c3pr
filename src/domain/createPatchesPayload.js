const c3prLOG = require("node-c3pr-logger");

function createPatchesPayload(toolInvocation, diffBase64) {

    const logMeta = {nodeName: 'c3pr-agent', correlationId: toolInvocation.meta.correlationId, moduleName: 'createPatchesPayload'};
    c3prLOG(`Called with tool: ${toolInvocation.tool.toolId}. Files: ${JSON.stringify(toolInvocation.files)}`, {toolInvocation, diffBase64}, logMeta);

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