const log = require("node-c3pr-logger").log;
const createPR = require('../domain/pr/createPR');
const config = require('../config');

async function handlePrs(prs) {
    log([prs.meta.correlationId], 'handlePrs', `Handling PR request title '${prs.repository.revision}' rev '${prs.repository.revision}'`, {prs});

    await createPR({
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

    log([prs.meta.correlationId], 'handlePrs', `PR created successfully.`);
}

module.exports = handlePrs;