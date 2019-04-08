const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;

const invokeToolAtGitRepo = require("./invokeToolAtGitRepo");

const config = require('../../config');

const loadTools = require('../tools/loadTools');


function generatePrBody(changed_files, toolPrBody, revision) {
    return (changed_files.length ? toolPrBody : '<no diff>') + `
---

This fix was generated in response to the commit ${revision}.`;
}

async function emitToolInvocationCompleted(toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested, lcid, sha, euuid) {
    const parent = {event_type: toolInvocationRequestedEvent.event_type, uuid: toolInvocationRequestedEvent.uuid};

    const changed_files = [
        ...(gitPatchBase64.files.added || []),
        ...(gitPatchBase64.files.modified || []),
        ...(gitPatchBase64.files.renamed.map(renamedFile => renamedFile.from) || []),
        ...(gitPatchBase64.files.renamed.map(renamedFile => renamedFile.to) || []),
        ...(gitPatchBase64.files.delete || [])
    ];
    const unmodified_files = toolInvocationRequested.files.filter(f => !changed_files.includes(f));

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    const pr_title = changed_files.length ? tool.pr_title : '<no diff>';
    const pr_body = generatePrBody(changed_files, tool.pr_body, toolInvocationRequested.repository.revision);

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
        lcid, sha, euuid
    }).catch(error => {
        const meta = {toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested};
        c3prLOG4(`Error while registering new event: ToolInvocationCompleted.`, {lcid, sha, euuid, error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    });

    if (changed_files.length) {
        c3prLOG4(`Tool invocation complete. A patch has been generated and sent.`, {lcid, sha, euuid});
    } else {
        c3prLOG4(`Tool invocation complete. No patch has been generated.`, {lcid, sha, euuid});
    }

    return {new_status: 'PROCESSED', result};
}

async function emitToolInvocationFailed(toolInvocationRequestedEvent, failure_message, toolInvocationRequested, lcid, sha, euuid) {
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
        lcid, sha, euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: ToolInvocationFailed.`, {lcid, sha, euuid, error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    });

    c3prLOG4(`Tool invocation failed. Reason: ${failure_message}`, {lcid, sha, euuid, meta});
    return {new_status: 'PROCESSED', result};
}

async function handleToolInvocation(toolInvocationRequestedEvent, {lcid, sha, euuid}) {

    const toolInvocationRequested = toolInvocationRequestedEvent.payload;

    c3prLOG4(`C-3PR Agent received invocation: ${toolInvocationRequested.tool_id}. Files: ${JSON.stringify(toolInvocationRequested.files)}`, {lcid, sha, euuid, meta: {toolInvocationRequestedEvent}});

    try {
        let gitPatchBase64 = await invokeToolAtGitRepo(toolInvocationRequested, loadTools, {lcid, sha, euuid});
        return await emitToolInvocationCompleted(toolInvocationRequestedEvent, gitPatchBase64, toolInvocationRequested, lcid, sha, euuid);
    } catch (error) {
        return await emitToolInvocationFailed(toolInvocationRequestedEvent, error.toString(), toolInvocationRequested, lcid, sha, euuid);
    }
}

module.exports = handleToolInvocation;