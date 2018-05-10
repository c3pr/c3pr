const c3prLOG = require("node-c3pr-logger");
const createGitLabMR = require('../domain/pr/createGitLabMR');
const config = require('../config');

async function handlePrs(prs) {
    const logMeta = {nodeName: 'c3pr-repo-gitlab', correlationId: prs.meta.correlationId, moduleName: 'handlePrs'};
    c3prLOG(`Handling PR request title '${prs.patch.title}' rev '${prs.repository.revision}'`, {prs}, logMeta);

    await createGitLabMR({
        mainRepoOrgRepo: prs.repository.fullpath,
        mainRepoBranch: prs.repository.branch,
        mainRepoHash: prs.repository.revision,
        gitLabUrl: config.c3pr.gitLabUrl,
        gitLabApiToken: config.c3pr.gitLabApiToken,
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