const c3prLOG = require("node-c3pr-logger");
const createGitLabPR = require('../domain/pr/createGitLabPR');
const config = require('../config');

async function handlePrs(prs) {
    const logMeta = {nodeName: 'c3pr-repo-gitlab', correlationId: prs.meta.correlationId, moduleName: 'handlePrs'};
    c3prLOG(`Handling PR request title '${prs.repository.revision}' rev '${prs.repository.revision}'`, {prs}, logMeta);

    await createGitLabPR({
        mainRepoOrgRepo: prs.repository.url.replace('https://github.com/', '').replace('.git', ''),
        mainRepoBranch: prs.repository.branch,
        mainRepoHash: prs.repository.revision,
        gitHubApiToken: config.c3pr.gitHubApiToken,
        gitUserName: config.c3pr.gitUserName,
        gitUserEmail: config.c3pr.gitUserEmail,
        prCommitMessage: prs.patch.title,
        prTitle: prs.patch.title,
        prBody: prs.patch.body,
        patchContent: prs.patch.diffBase64
    });

    c3prLOG(`PR created successfully.`, logMeta);
}

module.exports = handlePrs;