import c3prLOG5 from "node-c3pr-logger/c3prLOG5";


const agentRegistryDB = require('./agentRegistryDB');
const config = require('../../config');

async function putAgent(auth, agent) {
    if (
        !agent ||
        !agent.tool_id ||
        !Array.isArray(agent.extensions) ||
        !Array.isArray(agent.tags) ||
        !agent.weight ||
        !agent.expiration_time
    ) {
        throw new Error("Agent must of the format {tool_id, extensions, tags, weight, expiration_time}. Received: " + JSON.stringify(agent));
    }
    return putAgentToolId(auth, agent);
}

function putAgentToolId({sub: agent_id}, {tool_id, extensions, tags, weight, expiration_time}) {
    return agentRegistryDB.replaceOne(
        {tool_id, agent_id},
        {tool_id, agent_id, extensions, tags, weight, expiration_time: new Date(expiration_time), last_updated: new Date()},
        {upsert: true}
    );
}

function removeExpiredAgents() {
    const now = new Date();
    return agentRegistryDB.remove({expiration_time: {$lte: now}});
}

function removeAllAgents() {
    const futureDate = new Date(2099, 3);
    return agentRegistryDB.remove({expiration_time: {$lte: futureDate}});
}

// @ts-ignore
setInterval(removeExpiredAgents, config.c3pr.hub.agentRegistry.cleanRegistryStepInMs).unref();

export = {
    init: removeExpiredAgents().then(async () => { c3prLOG5(`Agents initialized. Database has ${(await agentRegistryDB.findAll()).length} agents.`, {caller_name: 'agentRegistry.ts', sha: '!hub-agent-registry'}); }),
    putAgent,
    findAll: agentRegistryDB.findAll,
    removeAllAgents
};