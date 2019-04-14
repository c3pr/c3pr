const axios = require('axios').default;
const config = require('../config');

async function fetchAllToolAgents() {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    let {data: toolAgents} = await axios.get(config.c3pr.hub.agentsUrl, {headers});
    return toolAgents;
}

export = fetchAllToolAgents;