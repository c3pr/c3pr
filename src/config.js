const agentUrl = process.env.C3PR_AGENT_URL || `http://${os.hostname()}:${port}`;

module.exports = {
    c3pr: {
        registryUrl: process.env.C3PR_REGISTRY_URL || 'http://host.docker.internal:5000',
        agent: {
            agentUrl: agentUrl,
            port: require('url').parse(agentUrl).port || 80,
            agentId: process.env.C3PR_AGENT_ID,
            cloneDir: process.env.C3PR_CLONE_DIR || '/tmp/c3pr/clones',
            cloneDepth: process.env.C3PR_CLONE_DEPTH || 50
        }
    }
};