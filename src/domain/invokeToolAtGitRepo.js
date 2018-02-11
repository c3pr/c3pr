const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const determineGitDiff = require("node-git-client").determineGitDiff;
const shell = require("node-git-client").shell;
const uuidv4 = require('uuid/v4');

const config = require('../config');

const CLONE_DIR = config.c3pr.agent.cloneDir;
const CLONE_DEPTH = config.c3pr.agent.cloneDepth;

async function invokeToolAtGitRepo(toolInvocation) {

    const localUniqueCorrelationId = uuidv4();
    const prefix = `[${toolInvocation.meta.correlationId}][${localUniqueCorrelationId}] [invokeToolAtGitRepo]`;

    console.log(`${prefix} >>> Invoking tool at git repo: ${toolInvocation.repository.url}`);

    const cloneFolder = await cloneRepositoryLocally({
        localUniqueCorrelationId: localUniqueCorrelationId,
        cloneBaseDir: CLONE_DIR,
        url: toolInvocation.repository.url,
        branch: toolInvocation.repository.branch,
        revision: toolInvocation.repository.revision,
        cloneDepth: CLONE_DEPTH
    });

    console.log(`${prefix} Done cloning at ${cloneFolder}`);

    await shell(toolInvocation.tool.command, {cwd: cloneFolder}, {stdout: true, prefix});

    return await determineGitDiff(toolInvocation.meta.correlationId, cloneFolder);

}

module.exports = invokeToolAtGitRepo;