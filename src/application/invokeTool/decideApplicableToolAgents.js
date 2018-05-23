const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const filterApplicableToolAgents = require('./filterApplicableToolAgents');
const fetchAllToolAgents = require('./fetchAllToolAgents');

function __shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// noinspection JSUnusedLocalSymbols
async function calculateAlreadyInvokedTools(changes_committed_root) {
    // TODO fetch from HUB all TIR events having this changes_committed_root arg as their changes_committed_root property.
    // return their tool_id in a string array
    return [];
}

async function decideApplicableToolAgents(changes_committed_root, files, logMetas) {
    const availableAgents = await fetchAllToolAgents();

    if (availableAgents.length === 0) {
        c3prLOG2({
            msg: `No available agents at the moment. Skipping.`,
            logMetas
        });
    }

    const applicableToolAgents = filterApplicableToolAgents(availableAgents, files);
    decideApplicableToolAgents.__shuffleArray(applicableToolAgents);

    const alreadyInvokedTools = await calculateAlreadyInvokedTools(changes_committed_root);

    return applicableToolAgents.filter(tool => !alreadyInvokedTools.includes(tool.tool_id));
}
// exposed for testing
decideApplicableToolAgents.__shuffleArray = __shuffleArray;

module.exports = decideApplicableToolAgents;