const axios = require('axios');

const config = require('../config');

c3prLOG(`Now broadcasting to C-3PR registry API: ${config.c3pr.hub.registryUrl}.`, logMeta);
setInterval(() => {
    axios.patch(config.c3pr.hub.registryUrl,
        {
            key: `agent://${config.c3pr.agent.agentId}`,
            value: {
                tool_id: "walkmod-sonar:AddCurlyBrackets",
                extensions: ["java"],
                tags: ["java"]
            },
            timeout: config.c3pr.hub.broadcastTimeoutInMs
        }
    ).catch((e) => {
        console.log(`Error while broadcasting to registry. URL: ${config.c3pr.hub.registryUrl}. - ${e}`);
    });
}, config.c3pr.hub.broadcastIntervalInMs);