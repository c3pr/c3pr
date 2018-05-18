const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const config = require('../config');
const loadToolsSummary = require('./loadToolsSummary');

function hubRegistryBroadcast() {
    const summary = loadToolsSummary();

    c3prLOG2({
        msg: `Now broadcasting to C-3PR registry API: ${config.c3pr.hub.registryUrl}.`,
        logMetas: [{nodeName: 'c3pr-agent', correlationIds: 'boot', moduleName: 'hubRegistryBroadcast'}],
        meta: {summary}
    });
    setInterval(() => {
        axios.patch(config.c3pr.hub.registryUrl,
            {
                key: `agent://${config.c3pr.agent.agentId}`,
                value: summary,
                timeout: config.c3pr.hub.broadcastTimeoutInMs
            }
        ).catch((e) => {
            console.log(`Error while broadcasting to registry. URL: ${config.c3pr.hub.registryUrl}. - ${e}`);
        });
    }, config.c3pr.hub.broadcastIntervalInMs);
}

module.exports = hubRegistryBroadcast;