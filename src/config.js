const port = process.env.PORT || 5003;

module.exports = {
    c3pr: {
        registryUrl: process.env.C3PR_DASHBOARD_URL || 'http://host.docker.internal:5000',
        agent: {
            port,
            agentUrl: process.env.C3PR_AGENT_URL || `http://${os.hostname()}:${port}`,
            toolId: process.env.C3PR_AGENT_URL || `http://${os.hostname()}:${port}`,
            cloneDir: process.env.C3PR_CLONE_DIR || '/tmp/c3pr/clones',
            cloneDepth: process.env.C3PR_CLONE_DEPTH || 50
        }
    }
};