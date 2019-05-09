import fetchAllToolAgents from "../../adapters/fetchAllToolAgents";
import config from "../../config";
import axios from "axios";


/**
 * Fetchs from HUB all TIR events having this changes_committed_root arg as their changes_committed_root property.
 */
async function fetchAlreadyInvokedToolsForCommit(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: toolInvocationRequestedEvents} = await axios.get(config.c3pr.hub.toolInvocationRequestedForRoot + changes_committed_root, {headers});

    return toolInvocationRequestedEvents.map(tire => tire.payload.tool_id);
}

async function fetchToolsNotYetInvokedForCommit(changesCommittedRootEuuid: string, c3prLOG5) {
    const availableToolAgents = await fetchAllToolAgents();
    if (!availableToolAgents.length) { c3prLOG5(`No available agents at the moment. Skipping.`); return []; }

    const alreadyInvokedToolAgents = await fetchAlreadyInvokedToolsForCommit(changesCommittedRootEuuid);

    const toolsNotYetInvokedForCommit = availableToolAgents.filter(tool => !alreadyInvokedToolAgents.includes(tool.tool_id));
    if (!toolsNotYetInvokedForCommit.length) { c3prLOG5(`All available agents have been invoked for this commit. Skipping.`); }

    return toolsNotYetInvokedForCommit;
}

export default fetchToolsNotYetInvokedForCommit