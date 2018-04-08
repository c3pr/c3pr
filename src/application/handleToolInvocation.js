const invokeToolAtGitRepo = require("../domain/invokeToolAtGitRepo");
const createPatchesPayload = require("../domain/createPatchesPayload");
const sendPatchToBot = require("../domain/sendPatchToBot");
const c3prLOG = require("node-c3pr-logger");

async function handleToolInvocation(toolInvocation) {

    c3prLOG(`C3PR Agent received invocation: ${toolInvocation.tool.toolId}. Files: ${JSON.stringify(toolInvocation.files)}`, {toolInvocation}, {nodeName: 'c3pr-agent', correlationId: toolInvocation.meta.correlationId, moduleName: 'handleToolInvocation'});

    try { // if (request.repository.type === "git")
        const diffBase64 = await invokeToolAtGitRepo(toolInvocation);

        const patchesPayload = createPatchesPayload(toolInvocation, diffBase64);

        sendPatchToBot(toolInvocation.c3pr.patchesUrl, patchesPayload);
    } catch (e) {
        c3prLOG('c3pr-agent', [toolInvocation.meta.correlationId], 'handleToolInvocation', `Error while invoking tool. \n${e}\n`)
    }

    c3prLOG(`Tool invocation complete.`, {nodeName: 'c3pr-agent', correlationId: toolInvocation.meta.correlationId, moduleName: 'handleToolInvocation'});

}

module.exports = handleToolInvocation;