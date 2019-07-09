const rimraf = require('rimraf');

const cloneRepositoryLocally = require("node-c3pr-git-client/src/cloneRepositoryLocally");
const generateGitPatchBase64 = require("node-c3pr-git-client/patch/generateGitPatchBase64").default;
const c3prSH4 = require("node-c3pr-git-client/src/c3prSH4").default;

const executeOnUtf8 = require('./executeOnUtf8');
const config = require('../../config');

// TODO replace with call to HUB
// noinspection JSUnresolvedVariable
const REPO_URL_CREDENTIALS = 'clone:' + (process.env.GITLAB_API_TOKEN || '-HCmXGsXkmrv7krhUiy3');

function addRepoCredentials(url) {
    return url.replace(/^http(s?):\/\//, `http$1://${REPO_URL_CREDENTIALS}@`);
}

/**
 * Invokes the tool at a git repo and returns {files: string[], diff: string}. Empty string if no changes were detected by git.
 *
 * @return {Promise<{files, patch}>}
 */
async function invokeToolAtGitRepo(toolInvocationRequested, loadTools, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'invokeToolAtGitRepo'});

    c3prLOG5(`Invoking tool at git repo: ${toolInvocationRequested.repository.clone_url_http}`);

    const tool = loadTools.toolsHash[toolInvocationRequested.tool_id];
    if (!tool) {
        const msg = `Tool of tool_id '${toolInvocationRequested.tool_id}' was not found!`;
        c3prLOG5(msg, {meta: {toolInvocationRequested}});
        throw new Error(msg);
    }

    let cloneFolder;
    try {
        cloneFolder = await cloneRepositoryLocally(
            {
                cloneBaseDir: config.c3pr.agent.cloneDir,
                url: addRepoCredentials(toolInvocationRequested.repository.clone_url_http),
                branch: toolInvocationRequested.repository.branch,
                revision: toolInvocationRequested.repository.revision,
                cloneDepth: config.c3pr.agent.cloneDepth
            },
            c3prLOG5({hide: {[REPO_URL_CREDENTIALS]: '<REPO_URL_CREDENTIALS>'}})
        );

        c3prLOG5(`Done cloning at ${cloneFolder}.`);

        for (let file of toolInvocationRequested.files) {
            await executeOnUtf8(cloneFolder, file, async () => {
                await c3prSH4(tool.command.replace(/#{filename}/g, file), {cwd: cloneFolder, maxBuffer: 1024 * 2000 /* 2MB */}, c3prLOG5, 'yes-output-to-stdout');
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
        if (cloneFolder) {
            c3prLOG5(`All work is done. Clone folder '${cloneFolder}' will be removed.`);
            rimraf(cloneFolder, () => {
                c3prLOG5(`Clone folder ${cloneFolder} removed.`);
            });
        }
    }

}

module.exports = invokeToolAtGitRepo;