const createPR = require('../domain/pr/createPR');

async function handlePrs(prs) {
    console.log(`[${prs.meta.correlationId}] [handlePrs] Handling pr request ${JSON.stringify(prs)}...`);

    await createPR({
        mainRepoOrgRepo: prs.repository.url.replace('https://github.com/', '').replace('.git', ''),
        mainRepoBranch: prs.repository.branch,
        mainRepoHash: prs.repository.revision,
        prCommitMessage: prs.patch.title,
        prTitle: prs.patch.title,
        prBody: prs.patch.body,
        patchContent: prs.patch.diffBase64
    });

    console.log(`[${prs.meta.correlationId}] [handlePrs] PR created successfully.`);
}

module.exports = handlePrs;