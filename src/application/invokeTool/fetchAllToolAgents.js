const axios = require('axios');

const config = require('../../config');

async function fetchAllToolAgents() {
    const headers = {Authorization: `Bearer ${config.c3pr.jwt}`};

    let {data: registry} = await axios.get(config.c3pr.hub.registryUrl, {headers});

    return Object.entries(registry).filter(([key]) => key.startsWith("agent://")).map(([key, value]) => value);
}

module.exports = fetchAllToolAgents;