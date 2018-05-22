const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const config = require('../../config');
const loadTools = require('../tools/loadTools');

const logMeta = {nodeName: 'c3pr-agent', correlationIds: 'boot', moduleName: 'hubRegistryBroadcast'};

function broadcast(summary) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    // noinspection JSUnresolvedFunction
    axios.patch(config.c3pr.hub.registryUrl,
        {
            key: `agent://${config.c3pr.agent.agentId}`,
            value: summary,
            timeout: config.c3pr.hub.broadcastTimeoutInMs
        },
        {headers}
    ).then(({data}) => {
        c3prLOG2({
            msg: `Successfully broadcasted to registry. URL: ${config.c3pr.hub.registryUrl}.`,
            logMetas: [logMeta],
            meta: {data, summary}
        });
    }).catch((e) => {
        c3prLOG2({
            msg: `Error while broadcasting to registry. URL: ${config.c3pr.hub.registryUrl}. Reason: '${e}'. Data: ${e.response && e.response.data}`,
            logMetas: [logMeta],
            meta: {error: require('util').inspect(e)}
        });
    });
}

function hubRegistryBroadcast() {
    const summary = loadTools.toolsSummary;
    c3prLOG2({
        msg: `Now broadcasting to C-3PR registry API: ${config.c3pr.hub.registryUrl}.`,
        logMetas: [logMeta],
        meta: {summary}
    });
    broadcast(summary);
    setInterval(() => {
        broadcast(summary);
    }, config.c3pr.hub.broadcastIntervalInMs);
}

module.exports = hubRegistryBroadcast;