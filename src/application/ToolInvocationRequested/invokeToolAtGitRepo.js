const rimraf = require('rimraf');

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
async function invokeToolAtGitRepo(toolInvocationRequested, loadTools, c3prLOG5) {

    c3prLOG5(`Invoking tool at git repo: ${toolInvocationRequested.repository.clone_url_http}`);

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    if (!tool) {
        const msg = `Tool of tool_id '${toolInvocationRequested.tool_id}' was not found!`;
        c3prLOG5(msg, {meta: {toolInvocation: toolInvocationRequested}});
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
            ...c3prLOG5
        });

        c3prLOG5(`Done cloning at ${cloneFolder}.`);

        for (let file of toolInvocationRequested.files) {
            await executeOnUtf8(cloneFolder, file, async () => {
                await c3prSH3(tool.command.replace(/#{filename}/g, file), {cwd: cloneFolder, maxBuffer: 1024 * 2000 /* 2MB */}, {stdout: true, ...c3prLOG5});
            });
        }

        c3prLOG5(`Done running tool on every modified file at ${cloneFolder}. Attempting to generate patch...`);

        let patch = await generateGitPatchBase64({cloneFolder, gitUserName: config.c3pr.agent.gitUserName, gitUserEmail: config.c3pr.agent.gitUserEmail, commitMessage: tool.pr_title}, {...c3prLOG5});

        c3prLOG5(`Patch generated.`);
        return patch;
    } catch (error) {
        c3prLOG5(`Error during invokeToolAtGitRepo.`, {error});
        return {files: [], patch: {hexBase64: ''}};
    } finally {
        c3prLOG5(`All work is done. Clone folder '${cloneFolder}' will be removed.`);
        if (cloneFolder) {
            rimraf(cloneFolder, () => {
                c3prLOG5(`Clone folder ${cloneFolder} removed.`);
            });
        }
    }

}

module.exports = invokeToolAtGitRepo;