const axios = require('axios').default;

const config = require('../../config');
const loadTools = require('../tools/loadTools');
const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!hub-registry-init'});


function broadcast(summary) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    const expirationTime = new Date(Date.now() + config.c3pr.hub.broadcastTimeoutInMs).toISOString();

    const toolSubmissions = summary.map(tool => {
        return axios.patch(config.c3pr.hub.agentsUrl, {...tool, expiration_time: expirationTime}, {headers})
    });
    Promise.all(
        toolSubmissions
    ).then(({data}) => {
        _c3prLOG5(`Successfully broadcasted to C-3PR HUB's Agent Registry. This agent's URL: ${config.c3pr.hub.agentsUrl}.`, {meta: {data, summary}});
    }).catch((error) => {
        _c3prLOG5(`Error while broadcasting to C-3PR HUB's Agent Registry. This agent's URL: ${config.c3pr.hub.agentsUrl}.`, {error});
    });
}

function hubRegistryBroadcast() {
    const summary = loadTools.toolsSummary;
    _c3prLOG5(`Now broadcasting to C-3PR HUB's Agent Registry API: ${config.c3pr.hub.agentsUrl}.`, {meta: {summary}});
    broadcast(summary);
    setInterval(() => {
        broadcast(summary);
    }, config.c3pr.hub.broadcastIntervalInMs);
}

module.exports = hubRegistryBroadcast;