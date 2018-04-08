const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const determineGitDiffBase64 = require("node-git-client").determineGitDiffBase64;
const shell = require("node-git-client").shell;
const uuidv4 = require('uuid/v4');

const c3prLOG = require("node-c3pr-logger");

const config = require('../config');

const CLONE_DIR = config.c3pr.agent.cloneDir;
const CLONE_DEPTH = config.c3pr.agent.cloneDepth;

async function invokeToolAtGitRepo(toolInvocation) {

    const localUniqueCorrelationId = uuidv4();
    const corrIds = [toolInvocation.meta.correlationId, localUniqueCorrelationId];
    const scriptName = 'invokeToolAtGitRepo';

    c3prLOG(`Invoking tool at git repo: ${toolInvocation.repository.url}`, {nodeName: 'c3pr-agent', correlationIds: corrIds, moduleNames: scriptName});

    const cloneFolder = await cloneRepositoryLocally({
        localUniqueCorrelationId: localUniqueCorrelationId,
        cloneBaseDir: CLONE_DIR,
        url: toolInvocation.repository.url,
        branch: toolInvocation.repository.branch,
        revision: toolInvocation.repository.revision,
        cloneDepth: CLONE_DEPTH
    });

    c3prLOG(`Done cloning at ${cloneFolder}.`, {nodeName: 'c3pr-agent', correlationIds: corrIds, moduleNames: scriptName});

    await shell(toolInvocation.tool.command, {cwd: cloneFolder}, {stdout: true, prefix: corrIds, scriptName: scriptName});

    return await determineGitDiffBase64(toolInvocation.meta.correlationId, localUniqueCorrelationId, cloneFolder);

}

module.exports = invokeToolAtGitRepo;