const os = require("os");
const isDocker = require("is-docker");

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || (isDocker() ? `http://host.docker.internal:5000` : `http://${os.hostname()}:5000`);

const agentUrl = process.env.C3PR_AGENT_URL || `http://${os.hostname()}:5003`;

module.exports = {
    c3pr: {
        hub:{
            registryUrl: `${C3PR_HUB_URL}/api/v1/registry`,

            broadcastTimeoutInMs: 10 * 60 * 60 * 1000, // 10 hours
            broadcastIntervalInMs: 8 * 60 * 60 * 1000, // 8 hours
        },
        agent: {
            agentUrl: agentUrl,
            port: require('url').parse(agentUrl).port || 80,
            agentId: process.env.C3PR_AGENT_ID,
            cloneDir: process.env.C3PR_CLONE_DIR || '/tmp/c3pr/clones',
            cloneDepth: process.env.C3PR_CLONE_DEPTH || 50
        }
    }
};