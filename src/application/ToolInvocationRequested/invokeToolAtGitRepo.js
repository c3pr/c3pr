const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const determineGitDiffBase64 = require("node-git-client").determineGitDiffBase64;
const c3prSH = require("node-git-client").c3prSH;
const uuidv4 = require('uuid/v4');

const config = require('../../config');

/**
 * Invokes the tool at a git repo and returns {files: string[], diff: string}. Empty string if no changes were detected by git.
 *
 * @return {Promise<{files, diff}>}
 */
async function invokeToolAtGitRepo(toolInvocation, loadTools) {

    const localUniqueCorrelationId = uuidv4();
    const logMeta = {nodeName: 'c3pr-agent', correlationIds: [toolInvocation.repository.revision, localUniqueCorrelationId], moduleName: 'invokeToolAtGitRepo'};

    c3prLOG2({msg: `Invoking tool at git repo: ${toolInvocation.repository.clone_url_http}`, logMetas: [logMeta]});

    const tool = loadTools.toolsHash[toolInvocation.tool_id];
    if (!tool) {
        const msg = `Tool of tool_id '${toolInvocation.tool_id}' was not found!`;
        c3prLOG2({
            msg,
            logMetas: [logMeta],
            meta: {toolInvocation}
        });
        throw new Error(msg);
    }

    const cloneFolder = await cloneRepositoryLocally({
        localUniqueCorrelationId: localUniqueCorrelationId,
        cloneBaseDir: config.c3pr.agent.cloneDir,
        url: toolInvocation.repository.clone_url_http,
        branch: toolInvocation.repository.branch,
        revision: toolInvocation.repository.revision,
        cloneDepth: config.c3pr.agent.cloneDepth
    }, logMeta);

    c3prLOG2({msg: `Done cloning at ${cloneFolder}.`, logMetas: [logMeta]});

    for (let file of toolInvocation.files) {
        await c3prSH(tool.command.replace(/#{filename}/g, file), {cwd: cloneFolder}, {stdout: true, logMeta});
    }

    return determineGitDiffBase64(toolInvocation.repository.revision, localUniqueCorrelationId, cloneFolder, logMeta);

}

module.exports = invokeToolAtGitRepo;