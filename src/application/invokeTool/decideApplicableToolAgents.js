const axios = require('axios').default;
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const config = require('../../config');
const ports = require('../ports');

const filterApplicableToolAgents = require('./filterApplicableToolAgents');

/**
 * Fetchs from HUB all TIR events having this changes_committed_root arg as their changes_committed_root property.
 */
async function calculateAlreadyInvokedTools(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: toolInvocationRequestedEvents} = await axios.get(config.c3pr.hub.toolInvocationRequestedForRoot + changes_committed_root, {headers});

    return toolInvocationRequestedEvents.map(tire => tire.payload.tool_id);
}

async function decideApplicableFiles(changes_committed_root, files) {
    const filesWithOpenPRs = await ports.retrieveFilesWithOpenPRs(changes_committed_root);
    const blacklistedFiles = await ports.fetchBlacklistedFiles(changes_committed_root);

    const patchableFiles = files.filter(file => !filesWithOpenPRs.includes(file)).filter(file => !blacklistedFiles.includes(file));
    return {patchableFiles, nonPatchableFiles: {filesWithOpenPRs, blacklistedFiles}};
}

async function decideApplicableToolAgents(changes_committed_root, files, {lcid, sha, euuid}) {
    const availableAgents = await ports.fetchAllToolAgents();

    if (availableAgents.length === 0) {
        c3prLOG4(`No available agents at the moment. Skipping.`, {lcid, sha, euuid});
        return [];
    }
    const {patchableFiles, nonPatchableFiles} = await decideApplicableFiles(changes_committed_root, files);

    if (!patchableFiles.length) {
        c3prLOG4(`No patchable files. Either all already have open PRs or are blacklisted. Skipping.`, {lcid, sha, euuid, meta: {files, nonPatchableFiles}});
        return [];
    }

    let applicableToolAgents = filterApplicableToolAgents(availableAgents, patchableFiles);
    applicableToolAgents = ports.shuffleArray(applicableToolAgents);

    const alreadyInvokedTools = await calculateAlreadyInvokedTools(changes_committed_root);

    return applicableToolAgents.filter(tool => !alreadyInvokedTools.includes(tool.tool_id));
}

module.exports = decideApplicableToolAgents;