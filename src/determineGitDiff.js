const shell = require('./shell');

async function determineGitDiff(correlationId, cloneFolder) {

    await shell(`git add -A`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [determineGitDiff]`});
    return await shell(`git diff --staged`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [determineGitDiff]`});

}

module.exports = determineGitDiff;