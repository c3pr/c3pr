const agentRegistryDB = require('./agentRegistryDB');
const config = require('../../config');

function putAgentsOrAgent(auth, agentOrAgents) {
    let entries = Array.isArray(agentOrAgents) ? agentOrAgents : [agentOrAgents];

    return Promise.all(entries.map(agent => putAgent(auth, agent)));
}

function putAgent(auth, agent) {
    if (!agent || !agent.tool_id || !agent.expiration_time) {
        throw new Error("Agent must have a tool_id and expiration_time. Received: " + JSON.stringify(agent));
    }
    const agentProps = {tool_id: agent.tool_id, agent_id: auth.sub};
    return agentRegistryDB.replaceOne(agentProps, {...agentProps, expiration_time: new Date(agent.expiration_time)}, {upsert: true});
}

function removeExpiredAgents() {
    const now = new Date();
    return agentRegistryDB.remove({expiration_time: {$lte: now}});
}

removeExpiredAgents(); // initial run
setInterval(removeExpiredAgents, config.c3pr.hub.agentRegistry.cleanRegistryStepInMs).unref();

module.exports = {
    putAgentsOrAgent,
    findAll: agentRegistryDB.findAll
};