const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const invokeToolAtGitRepo = require("./invokeToolAtGitRepo");

const config = require('../../config');

const loadTools = require('../tools/loadTools');

async function handleToolInvocation(toolInvocationRequestedEvent) {

    const toolInvocationRequested = toolInvocationRequestedEvent.payload;
    const logMetas = [{nodeName: 'c3pr-agent', correlationId: toolInvocationRequested.repository.revision, moduleName: 'handleToolInvocation'}];

    c3prLOG2({
        msg: `C-3PR Agent received invocation: ${toolInvocationRequested.tool_id}. Files: ${JSON.stringify(toolInvocationRequested.files)}`,
        logMetas,
        meta: {toolInvocationRequestedEvent}
    });

    const toolInvocationResult = await invokeToolAtGitRepo(toolInvocationRequested, loadTools);

    const parent = {event_type: toolInvocationRequestedEvent.event_type, uuid: toolInvocationRequestedEvent.uuid};

    const changed_files = toolInvocationResult.files;
    const unmodified_files = toolInvocationRequested.files.filter(f => !toolInvocationResult.files.includes(f));

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    const pr_title = toolInvocationResult.files.length ? tool.pr_title : '<no diff>';
    const pr_body = toolInvocationResult.files.length ? tool.pr_body : '<no diff>';
    const diff_base64 = toolInvocationResult.diff;

    await c3prRNE.registerNewEvent({
        event_type: `ToolInvocationCompleted`,
        payload: {
            parent,
            changes_committed_root: toolInvocationRequested.changes_committed_root,
            repository: toolInvocationRequested.repository,
            changed_files,
            unmodified_files,
            pr_title,
            pr_body,
            diff_base64
        },
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    }).catch(e => {
        c3prLOG2({
            msg: `Error while registering new event: ToolInvocationCompleted. Reason: '${e}'. Data: ${e.response.data}.`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
    });

    if (toolInvocationResult.files.length) {
        c3prLOG2({msg: `Tool invocation complete. A patch has been generated and sent.`, logMetas});
    } else {
        c3prLOG2({msg: `Tool invocation complete. No patch has been generated.`, logMetas});
    }
}

module.exports = handleToolInvocation;