const axios = require('axios').default;

const config = require('../../config');
const loadTools = require('../tools/loadTools');



function broadcast(summary, c3prLOG5) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    const expirationTime = new Date(Date.now() + config.c3pr.hub.broadcastTimeoutInMs).toISOString();

    const toolSubmissions = summary.map(tool => {
        return axios.patch(config.c3pr.hub.agentsUrl, {...tool, expiration_time: expirationTime}, {headers})
    });
    Promise.all(
        toolSubmissions
    ).then(({data}) => {
        c3prLOG5(`Successfully broadcasted to C-3PR HUB's Agent Registry. This agent's URL: ${config.c3pr.hub.agentsUrl}.`, {meta: {data, summary}});
    }).catch((error) => {
        c3prLOG5(`Error while broadcasting to C-3PR HUB's Agent Registry. This agent's URL: ${config.c3pr.hub.agentsUrl}.`, {error});
    });
}

function hubRegistryBroadcast(c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'hubRegistryBroadcast'});

    const summary = loadTools.toolsSummary;
    c3prLOG5(`Now broadcasting to C-3PR HUB's Agent Registry API: ${config.c3pr.hub.agentsUrl}.`, {meta: {summary}});

    broadcast(summary, c3prLOG5);
    setInterval(() => {
        broadcast(summary, c3prLOG5);
    }, config.c3pr.hub.broadcastIntervalInMs);
}

module.exports = hubRegistryBroadcast;