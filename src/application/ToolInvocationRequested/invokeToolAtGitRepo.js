const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;
const cloneRepositoryLocally = require("node-git-client").cloneRepositoryLocally;
const generateGitPatchBase64 = require("node-git-client/patch/generateGitPatchBase64").default;
const c3prSH = require("node-git-client").c3prSH;
const uuidv4 = require('uuid/v4');

const executeOnUtf8 = require('./executeOnUtf8');
const config = require('../../config');

/**
 * Invokes the tool at a git repo and returns {files: string[], diff: string}. Empty string if no changes were detected by git.
 *
 * @return {Promise<{files, patch}>}
 */
async function invokeToolAtGitRepo(toolInvocationRequested, loadTools) {

    const localUniqueCorrelationId = uuidv4();
    const ids = [toolInvocationRequested.repository.revision, localUniqueCorrelationId];
    const logMeta = {nodeName: 'c3pr-agent', correlationIds: ids, moduleName: 'invokeToolAtGitRepo'};
    try {

        c3prLOG3(`Invoking tool at git repo: ${toolInvocationRequested.repository.clone_url_http}`, {ids});

        const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
        if (!tool) {
            const msg = `Tool of tool_id '${toolInvocationRequested.tool_id}' was not found!`;
            c3prLOG3(msg, {ids, meta: {toolInvocation: toolInvocationRequested}});
            throw new Error(msg);
        }

        const cloneFolder = await cloneRepositoryLocally({
            localUniqueCorrelationId: localUniqueCorrelationId,
            cloneBaseDir: config.c3pr.agent.cloneDir,
            url: toolInvocationRequested.repository.clone_url_http,
            branch: toolInvocationRequested.repository.branch,
            revision: toolInvocationRequested.repository.revision,
            cloneDepth: config.c3pr.agent.cloneDepth
        }, logMeta);

        c3prLOG3(`Done cloning at ${cloneFolder}.`, {ids});

        for (let file of toolInvocationRequested.files) {
            await executeOnUtf8(cloneFolder, file, async () => {
                await c3prSH(tool.command.replace(/#{filename}/g, file), {cwd: cloneFolder, maxBuffer: 1024 * 2000 /* 2MB */}, {stdout: true, logMeta});
            });
        }

        return generateGitPatchBase64({cloneFolder, gitUserName: config.c3pr.agent.gitUserName, gitUserEmail: config.c3pr.agent.gitUserEmail, commitMessage: tool.pr_title}, {ids})
    } catch (error) {
        c3prLOG3(`Error during invokeToolAtGitRepo.`, {ids, error});
        return {files: [], patch: {hexBase64: ''}};
    }

}

module.exports = invokeToolAtGitRepo;