const axios = require('axios');
const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;

const config = require('../../config');
const loadTools = require('../tools/loadTools');

const ids = ['init'];
const logMeta = {nodeName: 'c3pr-agent', correlationIds: 'boot', moduleName: 'hubRegistryBroadcast'};

function broadcast(summary) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    const expirationTime = new Date(Date.now() + config.c3pr.hub.broadcastTimeoutInMs).toISOString();

    const toolSubmissions = summary.map(tool => {
        // noinspection JSUnresolvedFunction
        return axios.patch(config.c3pr.hub.agentsUrl, {...tool, expiration_time: expirationTime}, {headers})
    });
    Promise.all(
        toolSubmissions
    ).then(({data}) => {
        c3prLOG3(`Successfully broadcasted to registry. URL: ${config.c3pr.hub.agentsUrl}.`, {ids, meta: {data, summary}});
    }).catch((error) => {
        c3prLOG3(`Error while broadcasting to registry. URL: ${config.c3pr.hub.agentsUrl}.`, {ids, error});
    });
}

function hubRegistryBroadcast() {
    const summary = loadTools.toolsSummary;
    c3prLOG3(`Now broadcasting to C-3PR registry API: ${config.c3pr.hub.agentsUrl}.`, {ids, meta: {summary}});
    broadcast(summary);
    setInterval(() => {
        broadcast(summary);
    }, config.c3pr.hub.broadcastIntervalInMs);
}

module.exports = hubRegistryBroadcast;