const createPR = require('../domain/pr/createPR');

function handlePrs(prs) {
    console.log(`[${prs.meta.correlationId}] [handlePrs] Handling pr request ${JSON.stringify(prs)}...`);

    createPR({
        mainRepoOrgRepo: prs.repository.url.replace('https://github.com/', '').replace('.git', ''),
        mainRepoBranch: prs.repository.branch,
        mainRepoHash: prs.repository.revision,
        prCommitMessage: prs.patch.title,
        prTitle: prs.patch.title,
        prBody: prs.patch.body,
        patchContent: prs.patch.base64diff
    });
}

module.exports = handlePrs;