const invokeToolAtGitRepo = require("./invokeToolAtGitRepo");
const createPatchesPayload = require("./patch/createPatchesPayload");
const sendPatchToBot = require("./patch/sendPatchToBot");
const c3prLOG = require("node-c3pr-logger");

async function handleToolInvocation(toolInvocation) {

    const logMeta = {nodeName: 'c3pr-agent', correlationId: toolInvocation.meta.correlationId, moduleName: 'handleToolInvocation'};
    c3prLOG(`C3PR Agent received invocation: ${toolInvocation.tool.toolId}. Files: ${JSON.stringify(toolInvocation.files)}`, {toolInvocation}, logMeta);

    try { // if (request.repository.type === "git")
        const toolInvocationResult = await invokeToolAtGitRepo(toolInvocation);
        const aPatchHasBeenGenerated = toolInvocationResult.files.length;

        if (aPatchHasBeenGenerated) {
            const patchesPayload = createPatchesPayload(toolInvocation, toolInvocationResult);
            await sendPatchToBot(toolInvocation.c3pr.patchesUrl, patchesPayload);
            c3prLOG(`Tool invocation complete. A patch has been generated and sent.`, logMeta);
        } else {
            c3prLOG(`Tool invocation complete. No patch has been generated.`, logMeta);
        }

        return toolInvocationResult;
    } catch (e) {
        c3prLOG('c3pr-agent', [toolInvocation.meta.correlationId], 'handleToolInvocation', `Error while invoking tool. \n${e}\n`);
        return '';
    }
}

module.exports = handleToolInvocation;