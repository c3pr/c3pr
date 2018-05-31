const agentRegistryDB = require('./agentRegistryDB');
const config = require('../../config');

/**
 * Agent may have a single `tool_id` or a `tool_ids` - an array of `tool_id`s.
 */
async function putAgent(auth, agent) {
    if (!agent || (!agent.tool_id && !agent.tool_ids) || !agent.expiration_time) {
        throw new Error("Agent must have a (tool_id or tool_ids) and expiration_time. Received: " + JSON.stringify(agent));
    }
    if (agent.tool_ids) {
        const agents = agent.tool_ids.map(tid => ({...agent, tool_id: tid}));

        return Promise.all(agents.map(a => putAgentToolId(auth, a)));
    }
    return putAgentToolId(auth, agent);
}

function putAgentToolId({sub: agent_id}, {tool_id, expiration_time}) {
    return agentRegistryDB.replaceOne(
        {tool_id, agent_id},
        {tool_id, agent_id, expiration_time: new Date(expiration_time)},
        {upsert: true}
    );
}

function removeExpiredAgents() {
    const now = new Date();
    return agentRegistryDB.remove({expiration_time: {$lte: now}});
}

removeExpiredAgents(); // initial run
setInterval(removeExpiredAgents, config.c3pr.hub.agentRegistry.cleanRegistryStepInMs).unref();

module.exports = {
    putAgent,
    findAll: agentRegistryDB.findAll
};