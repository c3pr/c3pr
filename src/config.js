const os = require("os");

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || (require("is-docker")() ? `http://host.docker.internal:5000` : `http://${os.hostname()}:5000`);
const C3PR_AGENT_URL = process.env.C3PR_AGENT_URL || `http://${os.hostname()}:5003`;

// The env variables below are typically set at build time in the Dockerfile
const C3PR_AGENT_TOOLS_PATH = process.env.C3PR_AGENT_TOOLS_PATH || `/c3pr/agent/tools`;
const C3PR_AGENT_ID = process.env.C3PR_AGENT_ID;
const C3PR_CLONE_DIR = process.env.C3PR_CLONE_DIR || '/tmp/c3pr/clones';
const C3PR_CLONE_DEPTH = process.env.C3PR_CLONE_DEPTH || 50;

module.exports = {
    c3pr: {
        auth: {
            jwt: null
        },
        hub:{
            registryUrl: `${C3PR_HUB_URL}/api/v1/registry`,

            broadcastTimeoutInMs: 10 * 60 * 60 * 1000, // 10 hours
            broadcastIntervalInMs: 8 * 60 * 60 * 1000, // 8 hours
        },
        agent: {
            agentToolsPath: C3PR_AGENT_TOOLS_PATH,
            agentUrl: C3PR_AGENT_URL,
            port: require('url').parse(C3PR_AGENT_URL).port || 80,
            agentId: C3PR_AGENT_ID,
            cloneDir: C3PR_CLONE_DIR,
            cloneDepth: C3PR_CLONE_DEPTH
        }
    }
};