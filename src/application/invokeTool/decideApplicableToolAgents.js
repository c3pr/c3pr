const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const axios = require('axios').default;
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

async function decideApplicableToolAgents(changes_committed_root, files, logMetas) {
    const availableAgents = await ports.fetchAllToolAgents();

    if (availableAgents.length === 0) {
        c3prLOG2({
            msg: `No available agents at the moment. Skipping.`,
            logMetas,
        });
        return [];
    }

    const filesWithOpenPRs = await ports.retrieveFilesWithOpenPRs(changes_committed_root);

    const filesWithoutOpenPRs = files.filter(file => !filesWithOpenPRs.includes(file));

    if (!filesWithoutOpenPRs.length) {
        c3prLOG2({
            msg: `No files without open PRs. Skipping.`,
            logMetas,
            meta: {filesWithOpenPRs, files}
        });
        return [];
    }

    let applicableToolAgents = filterApplicableToolAgents(availableAgents, filesWithoutOpenPRs);
    applicableToolAgents = ports.shuffleArray(applicableToolAgents);

    const alreadyInvokedTools = await calculateAlreadyInvokedTools(changes_committed_root);

    return applicableToolAgents.filter(tool => !alreadyInvokedTools.includes(tool.tool_id));
}

module.exports = decideApplicableToolAgents;