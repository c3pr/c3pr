const invokeToolAtGitRepo = require("../domain/invokeToolAtGitRepo");
const createPatchesPayload = require("../domain/createPatchesPayload");
const sendPatchToBot = require("../domain/sendPatchToBot");
const c3prLOG = require("node-c3pr-logger");

async function handleToolInvocation(toolInvocation) {

    c3prLOG('c3pr-agent', [toolInvocation.meta.correlationId], 'handleToolInvocation', `C3PR Agent received invocation with args: ${JSON.stringify(toolInvocation)}`);

    try { // if (request.repository.type === "git")
        const diffBase64 = await invokeToolAtGitRepo(toolInvocation);

        const patchesPayload = createPatchesPayload(toolInvocation, diffBase64);

        sendPatchToBot(toolInvocation.c3pr.patchesUrl, patchesPayload);
    } catch (e) {
        c3prLOG('c3pr-agent', [toolInvocation.meta.correlationId], 'handleToolInvocation', `Error while invoking tool. \n${e}\n`)
    }

    c3prLOG('c3pr-agent', [toolInvocation.meta.correlationId], 'handleToolInvocation', `Tool invocation complete.`);

}

module.exports = handleToolInvocation;