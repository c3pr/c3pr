const invokeToolAtGitRepo = require("../domain/invokeToolAtGitRepo");
const convertDiffToBase64 = require("../domain/convertDiffToBase64");
const createPatchesPayload = require("../domain/createPatchesPayload");
const sendPatchToBot = require("../domain/sendPatchToBot");

async function handleToolInvocation(toolInvocation) {

    console.log(`[${toolInvocation.meta.correlationId}] [handleToolInvocation] C3PR Agent received invocation with args: ${JSON.stringify(toolInvocation)}`);

    try { // if (request.repository.type === "git")
        const gitDiff = await invokeToolAtGitRepo(toolInvocation);

        const base64Diff = convertDiffToBase64(gitDiff);

        const patchesPayload = createPatchesPayload(toolInvocation, base64Diff);

        return sendPatchToBot(patchesPayload);
    } catch (e) {
        console.error(`[${toolInvocation.meta.correlationId}] [handleToolInvocation] Error while invoking tool. \n${e}\n\n\n`)
    }

}

module.exports = handleToolInvocation;