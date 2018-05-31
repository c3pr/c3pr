const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const axios = require('axios');
const config = require('../../config');

const filterApplicableToolAgents = require('./filterApplicableToolAgents');
const fetchAllToolAgents = require('./fetchAllToolAgents');

function __shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Fetchs from HUB all TIR events having this changes_committed_root arg as their changes_committed_root property.
 */
async function calculateAlreadyInvokedTools(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: toolInvocationRequestedEvents} = await axios.get(config.c3pr.hub.toolInvocationRequestedForRoot + changes_committed_root, {headers});

    return toolInvocationRequestedEvents.map(tire => tire.payload.tool_id);
}

/**
 * Returns all files with an open PR that was created by the bot.
 */
async function retrieveFilesWithOpenPRs(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: {project_uuid}} = await axios.get(config.c3pr.hub.changesCommittedOfUuidUrl.replace(/:uuid/, changes_committed_root), {headers});
    let {data: filesWithOpenPRs} = await axios.get(config.c3pr.hub.filesWithOpenPRsForProjectUrl.replace(/:project_uuid/, project_uuid), {headers});
    return filesWithOpenPRs;
}

async function decideApplicableToolAgents(changes_committed_root, files, logMetas) {
    const availableAgents = await fetchAllToolAgents();

    if (availableAgents.length === 0) {
        c3prLOG2({
            msg: `No available agents at the moment. Skipping.`,
            logMetas,
        });
        return [];
    }

    const filesWithOpenPRs = retrieveFilesWithOpenPRs(changes_committed_root);

    const filesWithoutOpenPRs = files.filter(file => !filesWithOpenPRs.includes(file));

    if (!filesWithoutOpenPRs.length) {
        c3prLOG2({
            msg: `No files without open PRs. Skipping.`,
            logMetas,
            meta: {filesWithOpenPRs, files}
        });
        return [];
    }

    const applicableToolAgents = filterApplicableToolAgents(availableAgents, filesWithoutOpenPRs);
    decideApplicableToolAgents.__shuffleArray(applicableToolAgents);

    const alreadyInvokedTools = await calculateAlreadyInvokedTools(changes_committed_root);

    return applicableToolAgents.filter(tool => !alreadyInvokedTools.includes(tool.tool_id));
}
// exposed for testing
decideApplicableToolAgents.__shuffleArray = __shuffleArray;

module.exports = decideApplicableToolAgents;