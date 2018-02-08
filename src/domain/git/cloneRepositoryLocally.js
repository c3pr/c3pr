const clone = require('git-clone');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const shell = require('../shell');

const config = require('../../config');

const CLONE_DIR = config.c3pr.agent.cloneDir;
const CLONE_DEPTH = config.c3pr.agent.cloneDepth;

async function createClonesDir(correlationId) {
    return new Promise(resolve => {
        const resolvedClonesDir = path.resolve(CLONE_DIR);
        if (fs.existsSync(resolvedClonesDir)) {
            console.log(`[${correlationId}] [cloneRepositoryLocally] ${resolvedClonesDir} already exists.`);
            resolve();
        } else {
            console.log(`[${correlationId}] [cloneRepositoryLocally] ${resolvedClonesDir} does not exist, creating.`);
            mkdirp(resolvedClonesDir, () => {
                console.log(`[${correlationId}] [cloneRepositoryLocally] Clones dir created at ${resolvedClonesDir}`);
                resolve();
            });
        }
    });
}


async function gitClone(repoURL, cloneFolder, branch, gitSHA) {
    const correlationId = gitSHA;
    await createClonesDir(gitSHA);

    console.log(`[${correlationId}] [cloneRepositoryLocally] Cloning repo ${repoURL}#${gitSHA} at ${cloneFolder}...`);

    // clones that single branch (maybe there is a somewhat slightly faster way of doing this with --mirror, though I feel it probably won't pay off)
    await shell(`git clone -b ${branch} --depth ${CLONE_DEPTH} --single-branch ${repoURL} ${cloneFolder}`, {}, {prefix: `[${correlationId}] [cloneRepositoryLocally]`});

    //////////////////////////////////////////////////////////////////////////////////////////////
    //NOTE:
    // the CLONE_DEPTH depth above is an attempt at not downloading the whole tree
    // if there are too fast too many commits to the branch before this tool clones the repo, then the depth may not
    // be enough. That is, if there are more than CLONE_DEPTH revisions between the time the webhook was triggered and this clone ran.
    //
    // It should be pretty rare, but in that situation we will get an error like:
    //
    // $ git reset --hard 30b03c1d8aa6ee670534b80edd0dc39c12644259
    // fatal: Could not parse object '30b03c1d8aa6ee670534b80edd0dc39c12644259'.
    //
    // so, maybe later, add a try/catch to retry and increase de depth in case it is not found, if that is even possible.
    // right now, though, I feel the constant CLONE_DEPTH is pretty much enough.
    //////////////////////////////////////////////////////////////////////////////////////////////

    await shell(`git reset --hard ${gitSHA}`, {cwd: cloneFolder}, {prefix: `[${correlationId}] [cloneRepositoryLocally]`});

    console.log(`[${correlationId}] [cloneRepositoryLocally] Clone/reset completed.`);
}

module.exports = async function ({localUniqueCorrelationId, url, branch, revision}) {

    const repoURL = url;
    const gitSHA = revision;
    const cloneFolder = path.resolve(path.join(CLONE_DIR, gitSHA, localUniqueCorrelationId));

    // clones at "CLONE_DIR/SHA/RANDOMUUID", e.g. "./tmp/59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5/471ff3f9-2ada-48eb-a0f3-3ab70f3f0bdd"
    await gitClone(repoURL, cloneFolder, branch, gitSHA);

    return cloneFolder;

};