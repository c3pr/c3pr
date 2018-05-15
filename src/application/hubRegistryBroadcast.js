const axios = require('axios');

const config = require('../config');

const fs = require('fs');
if (!fs.existsSync(config.c3pr.agent.agentToolsPath)) {
    throw new Error(`Could not find tools file at 'C3PR_AGENT_TOOLS_PATH': ${config.c3pr.agent.agentToolsPath}`);
}

const tools = require(config.c3pr.agent.agentToolsPath);
if (!tools.summary) {
    throw new Error(`The object at 'C3PR_AGENT_TOOLS_PATH' (${config.c3pr.agent.agentToolsPath}) does not have a 'summary' property.`);
}

c3prLOG(`Now broadcasting to C-3PR registry API: ${config.c3pr.hub.registryUrl}.`, logMeta);
setInterval(() => {
    axios.patch(config.c3pr.hub.registryUrl,
        {
            key: `agent://${config.c3pr.agent.agentId}`,
            value: tools.summary,
            timeout: config.c3pr.hub.broadcastTimeoutInMs
        }
    ).catch((e) => {
        console.log(`Error while broadcasting to registry. URL: ${config.c3pr.hub.registryUrl}. - ${e}`);
    });
}, config.c3pr.hub.broadcastIntervalInMs);