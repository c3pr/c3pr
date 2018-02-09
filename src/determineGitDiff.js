const shellOut = require('./shell').shellOut;
const shell = require('./shell').shell;

async function determineGitDiff(correlationId, cloneFolder) {

    await shell(`git add -A`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [determineGitDiff]`});
    return await shellOut(`git diff --staged`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [determineGitDiff]`});

}

module.exports = determineGitDiff;