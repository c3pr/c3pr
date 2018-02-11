const shell = require('./shell');

async function determineGitDiff(correlationId, localUniqueCorrelationId, cloneFolder) {

    await shell(`git add -A`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [${localUniqueCorrelationId}] [determineGitDiff]`});
    return await shell(`git diff --staged`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [${localUniqueCorrelationId}] [determineGitDiff]`});

}

module.exports = determineGitDiff;