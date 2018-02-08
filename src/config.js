
module.exports = {
    c3pr: {
        agent: {
            cloneDir: process.env.C3PR_CLONE_DIR || '/tmp/c3pr/clones',
            cloneDepth: process.env.C3PR_CLONE_DEPTH || 50
        }
    }
};