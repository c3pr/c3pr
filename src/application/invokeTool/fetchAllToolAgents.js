const axios = require('axios');

const config = require('../../config');

async function fetchAllToolAgents() {
    const headers = {Authorization: `Bearer ${config.c3pr.jwt}`};

    let {data: registry} = await axios.get(config.c3pr.hub.registryUrl, {headers});

    const agentValues = Object.entries(registry).filter(([key]) => key.startsWith("agent://")).map(([key, value]) => value);

    const toolAgents = [];
    agentValues.forEach(agentValue => {
        if (Array.isArray(agentValue)) {
            toolAgents.push(...agentValue);
        } else {
            toolAgents.push(agentValue);
        }
    });
    return toolAgents;
}

module.exports = fetchAllToolAgents;