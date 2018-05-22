const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const invokeToolAtGitRepo = require("./invokeToolAtGitRepo");
const createPatchesPayload = require("./patch/createPatchesPayload");
const sendPatchToBot = require("./patch/sendPatchToBot");

async function handleToolInvocation(toolInvocationEvent) {

    const toolInvocation = toolInvocationEvent.payload;
    const logMetas = [{nodeName: 'c3pr-agent', correlationId: toolInvocation.repository.revision, moduleName: 'handleToolInvocation'}];

    c3prLOG2({
        msg: `C-3PR Agent received invocation: ${toolInvocation.tool_id}. Files: ${JSON.stringify(toolInvocation.files)}`,
        logMetas,
        meta: {toolInvocationEvent}
    });

    try {
        const toolInvocationResult = await invokeToolAtGitRepo(toolInvocationEvent);
        const aPatchHasBeenGenerated = toolInvocationResult.files.length;

        if (aPatchHasBeenGenerated) {
            if (false) {
                const patchesPayload = createPatchesPayload(toolInvocationEvent, toolInvocationResult);
                await sendPatchToBot(toolInvocationEvent.c3pr.patchesUrl, patchesPayload);
            }
            c3prLOG2({msg: `Tool invocation complete. A patch has been generated and sent.`, logMetas});
            // create TIC saying files were handled
            // status(200).send({files: toolInvocationResult.files, description: 'This tool invocation completed successfully and has generated a diff.'});
        } else {
            c3prLOG2({msg: `Tool invocation complete. No patch has been generated.`, logMetas});
            // create TIC saying files were NOT handled
            // status(204).send({files: toolInvocationResult.files, description: 'This tool invocation completed successfully and has NOT generated a diff.'});
        }
    } catch (e) {
        c3prLOG2({
            msg: `Error while invoking tool. Reason: '${e}'. Data: ${e.response && e.response.data}`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
    }
}

module.exports = handleToolInvocation;