const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const determineGitDiffBase64 = require("node-git-client").determineGitDiffBase64;
const c3prSH = require("node-git-client").c3prSH;
const uuidv4 = require('uuid/v4');

const c3prLOG = require("node-c3pr-logger");

const config = require('../config');

const CLONE_DIR = config.c3pr.agent.cloneDir;
const CLONE_DEPTH = config.c3pr.agent.cloneDepth;

/**
 * Invokes the tool at a git repo and returns the diff. Empty string if no changes were detected by git.
 */
async function invokeToolAtGitRepo(toolInvocation) {

    const localUniqueCorrelationId = uuidv4();
    const logMeta = {nodeName: 'c3pr-agent', correlationIds: [toolInvocation.meta.correlationId, localUniqueCorrelationId], moduleName: 'invokeToolAtGitRepo'};

    c3prLOG(`Invoking tool at git repo: ${toolInvocation.repository.url}`, logMeta);

    const cloneFolder = await cloneRepositoryLocally({
        localUniqueCorrelationId: localUniqueCorrelationId,
        cloneBaseDir: CLONE_DIR,
        url: toolInvocation.repository.url,
        branch: toolInvocation.repository.branch,
        revision: toolInvocation.repository.revision,
        cloneDepth: CLONE_DEPTH
    }, logMeta);

    c3prLOG(`Done cloning at ${cloneFolder}.`, logMeta);

    await c3prSH(toolInvocation.tool.command, {cwd: cloneFolder}, {stdout: true, logMeta});

    return determineGitDiffBase64(toolInvocation.meta.correlationId, localUniqueCorrelationId, cloneFolder, logMeta);

}

module.exports = invokeToolAtGitRepo;