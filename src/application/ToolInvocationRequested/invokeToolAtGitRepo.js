const rimraf = require('rimraf');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const cloneRepositoryLocally = require("node-c3pr-git-client/src/cloneRepositoryLocally");
const generateGitPatchBase64 = require("node-c3pr-git-client/patch/generateGitPatchBase64").default;
const c3prSH3 = require("node-c3pr-git-client/src/c3prSH3").default;
const uuidv4 = require('uuid/v4');

const executeOnUtf8 = require('./executeOnUtf8');
const config = require('../../config');

/**
 * Invokes the tool at a git repo and returns {files: string[], diff: string}. Empty string if no changes were detected by git.
 *
 * @return {Promise<{files, patch}>}
 */
async function invokeToolAtGitRepo(toolInvocationRequested, loadTools, {lcid, euuid}) {


    c3prLOG4(`Invoking tool at git repo: ${toolInvocationRequested.repository.clone_url_http}`, {lcid, euuid});

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    if (!tool) {
        const msg = `Tool of tool_id '${toolInvocationRequested.tool_id}' was not found!`;
        c3prLOG4(msg, {lcid, euuid, meta: {toolInvocation: toolInvocationRequested}});
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(msg);
    }

    let cloneFolder;
    try {
        cloneFolder = await cloneRepositoryLocally({
            localUniqueCorrelationId: uuidv4(),
            cloneBaseDir: config.c3pr.agent.cloneDir,
            url: toolInvocationRequested.repository.clone_url_http,
            branch: toolInvocationRequested.repository.branch,
            revision: toolInvocationRequested.repository.revision,
            cloneDepth: config.c3pr.agent.cloneDepth,
            lcid,
            euuid
        });

        c3prLOG4(`Done cloning at ${cloneFolder}.`, {lcid, euuid});

        for (let file of toolInvocationRequested.files) {
            await executeOnUtf8(cloneFolder, file, async () => {
                await c3prSH3(tool.command.replace(/#{filename}/g, file), {cwd: cloneFolder, maxBuffer: 1024 * 2000 /* 2MB */}, {stdout: true, lcid, euuid});
            });
        }

        return generateGitPatchBase64({cloneFolder, gitUserName: config.c3pr.agent.gitUserName, gitUserEmail: config.c3pr.agent.gitUserEmail, commitMessage: tool.pr_title}, {lcid, euuid})
    } catch (error) {
        c3prLOG4(`Error during invokeToolAtGitRepo.`, {lcid, euuid, error});
        return {files: [], patch: {hexBase64: ''}};
    } finally {
        if (cloneFolder) {
            rimraf(cloneFolder, () => {
                c3prLOG4(`Clone folder ${cloneFolder} removed.`, {lcid, euuid});
            });
        }
    }

}

module.exports = invokeToolAtGitRepo;