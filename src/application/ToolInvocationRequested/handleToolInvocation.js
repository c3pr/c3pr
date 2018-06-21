const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const invokeToolAtGitRepo = require("./invokeToolAtGitRepo");

const config = require('../../config');

const loadTools = require('../tools/loadTools');

async function emitToolInvocationCompleted(toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested, ids) {
    const parent = {event_type: toolInvocationRequestedEvent.event_type, uuid: toolInvocationRequestedEvent.uuid};

    const changed_files = gitPatchBase64.files;
    const unmodified_files = toolInvocationRequested.files.filter(f => !gitPatchBase64.files.includes(f));

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    const pr_title = gitPatchBase64.files.length ? tool.pr_title : '<no diff>';
    const pr_body = gitPatchBase64.files.length ? tool.pr_body : '<no diff>';
    const diff_base64 = gitPatchBase64.patch.hexBase64;

    let result = await c3prRNE.registerNewEvent({
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
        logMetas: [{nodeName: 'c3pr-agent', correlationIds: ids, moduleName: 'handleToolInvocation'}]
    }).catch(error => {
        const meta = {toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested};
        c3prLOG3(`Error while registering new event: ToolInvocationCompleted.`, {ids, error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    });

    if (gitPatchBase64.files.length) {
        c3prLOG3(`Tool invocation complete. A patch has been generated and sent.`, {ids});
    } else {
        c3prLOG3(`Tool invocation complete. No patch has been generated.`, {ids});
    }

    return {new_status: 'PROCESSED', result};
}

async function emitToolInvocationFailed(toolInvocationRequestedEvent, failure_message, toolInvocationRequested, ids) {
    const meta = {toolInvocationRequestedEvent, failure_message, toolInvocationRequested};
    const parent = {event_type: toolInvocationRequestedEvent.event_type, uuid: toolInvocationRequestedEvent.uuid};

    let result = await c3prRNE.registerNewEvent({
        event_type: `ToolInvocationFailed`,
        payload: {
            parent,
            changes_committed_root: toolInvocationRequested.changes_committed_root,
            repository: toolInvocationRequested.repository,
            failure_message
        },
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas: [{nodeName: 'c3pr-agent', correlationIds: ids, moduleName: 'handleToolInvocation'}]
    }).catch(error => {
        c3prLOG3(`Error while registering new event: ToolInvocationCompleted.`, {ids, error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    });

    c3prLOG3(`Tool invocation failed. Reason: ${failure_message}`, {ids, meta});
    return {new_status: 'PROCESSED', result};
}

async function handleToolInvocation(toolInvocationRequestedEvent) {

    const toolInvocationRequested = toolInvocationRequestedEvent.payload;

    const ids = [toolInvocationRequested.repository.revision];
    c3prLOG3(`C-3PR Agent received invocation: ${toolInvocationRequested.tool_id}. Files: ${JSON.stringify(toolInvocationRequested.files)}`, {ids, meta: {toolInvocationRequestedEvent}});

    let gitPatchBase64;
    try {
        gitPatchBase64 = await invokeToolAtGitRepo(toolInvocationRequested, loadTools);
    } catch (error) {
        return await emitToolInvocationFailed(toolInvocationRequestedEvent, error.toString(), toolInvocationRequested, ids);
    }
    return await emitToolInvocationCompleted(toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested, ids);
}

module.exports = handleToolInvocation;