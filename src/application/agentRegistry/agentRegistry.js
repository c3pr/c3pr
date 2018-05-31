const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const agentRegistryDB = require('./agentRegistryDB');
const config = require('../../config');

async function putAgent(auth, agent) {
    if (!agent || !agent.tool_id || !Array.isArray(agent.extensions) || !Array.isArray(agent.tags) || !agent.expiration_time) {
        throw new Error("Agent must of the format {tool_id, extensions, tags, expiration_time}. Received: " + JSON.stringify(agent));
    }
    return putAgentToolId(auth, agent);
}

function putAgentToolId({sub: agent_id}, {tool_id, extensions, tags, expiration_time}) {
    return agentRegistryDB.replaceOne(
        {tool_id, agent_id},
        {tool_id, agent_id, extensions, tags, expiration_time: new Date(expiration_time)},
        {upsert: true}
    );
}

function removeExpiredAgents() {
    const now = new Date();
    return agentRegistryDB.remove({expiration_time: {$lte: now}});
}

const logMetas = [{nodeName: 'c3pr-hub', moduleName: 'agentRegistry'}];
removeExpiredAgents().then(async () => {
    c3prLOG2({
        msg: 'Agents initialized. Database has ' + (await agentRegistryDB.findAll()).length + ' agents.', logMetas
    });
});

setInterval(removeExpiredAgents, config.c3pr.hub.agentRegistry.cleanRegistryStepInMs).unref();

module.exports = {
    putAgent,
    findAll: agentRegistryDB.findAll
};