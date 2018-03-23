const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const determineGitDiffBase64 = require("node-git-client").determineGitDiffBase64;
const shell = require("node-git-client").shell;
const uuidv4 = require('uuid/v4');

const log = require("node-c3pr-logger").log;

const config = require('../config');

const CLONE_DIR = config.c3pr.agent.cloneDir;
const CLONE_DEPTH = config.c3pr.agent.cloneDepth;

async function invokeToolAtGitRepo(toolInvocation) {

    const localUniqueCorrelationId = uuidv4();
    const corrIds = [toolInvocation.meta.correlationId, localUniqueCorrelationId];
    const scriptName = 'invokeToolAtGitRepo';

    log.info(corrIds, scriptName, `Invoking tool at git repo: ${toolInvocation.repository.url}`);

    const cloneFolder = await cloneRepositoryLocally({
        localUniqueCorrelationId: localUniqueCorrelationId,
        cloneBaseDir: CLONE_DIR,
        url: toolInvocation.repository.url,
        branch: toolInvocation.repository.branch,
        revision: toolInvocation.repository.revision,
        cloneDepth: CLONE_DEPTH
    });

    log.info(corrIds, scriptName, `Done cloning at ${cloneFolder}.`);

    await shell(toolInvocation.tool.command, {cwd: cloneFolder}, {stdout: true, prefix: corrIds, scriptName: scriptName});

    return await determineGitDiffBase64(toolInvocation.meta.correlationId, localUniqueCorrelationId, cloneFolder);

}

module.exports = invokeToolAtGitRepo;