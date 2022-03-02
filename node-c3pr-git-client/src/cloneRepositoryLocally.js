const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const c3prSH4 = require('./c3prSH4').default;


async function createClonesDir(cloneBaseDir, c3prLOG5) {
    return new Promise(resolve => {
        const resolvedClonesDir = path.resolve(cloneBaseDir);
        if (fs.existsSync(resolvedClonesDir)) {
            c3prLOG5(`${resolvedClonesDir} already exists.`);
            resolve();
        } else {
            c3prLOG5(`${resolvedClonesDir} does not exist, creating.`);
            mkdirp(resolvedClonesDir, () => {
                c3prLOG5(`Clones dir created at ${resolvedClonesDir}`);
                resolve();
            });
        }
    });
}

async function gitClone(cloneBaseDir, repoURL, cloneFolder, branch, gitSHA, cloneDepth, c3prLOG5) {

    await createClonesDir(cloneBaseDir, c3prLOG5);

    c3prLOG5(`Cloning repo ${repoURL}#${gitSHA} at ${cloneFolder}...`);

    // clones that single branch (maybe there is a somewhat slightly faster way of doing this with --mirror, though I feel it probably won't pay off)
    await c3prSH4(
        `git clone --config core.autocrlf=false -b ${branch} --depth ${cloneDepth} --single-branch ${repoURL} ${cloneFolder}`,
        {},
        c3prLOG5
    );

    //////////////////////////////////////////////////////////////////////////////////////////////
    //NOTE:
    // the "cloneDepth" depth above is an attempt at not downloading the whole tree
    // if there are too many commits to the branch before this tool clones the repo, then the depth may not
    // be enough. That is, if there are more than "cloneDepth" revisions between the time the webhook was triggered and this clone ran.
    //
    // It should be uncommon, except if the events sit unprocessed for too long. In such situation we will get an error like:
    //
    // $ git reset --hard 30b03c1d8aa6ee670534b80edd0dc39c12644259
    // fatal: Could not parse object '30b03c1d8aa6ee670534b80edd0dc39c12644259'.
    //
    // so, maybe later add a try/catch to retry and increase de depth in case it is not found, if that is even possible.
    // right now, though, I feel the constant "cloneDepth" is enough.
    //////////////////////////////////////////////////////////////////////////////////////////////

    await c3prSH4(`git reset --hard ${gitSHA}`, {cwd: cloneFolder}, c3prLOG5);

    c3prLOG5(`Clone/reset completed.`);
}

async function cloneRepositoryLocally({cloneBaseDir, url, branch, revision, cloneDepth}, c3prLOG5) {
    const gitSHA = revision;
    const localUniqueCorrelationId = uuidv4();
    const cloneFolder = path.resolve(path.join(cloneBaseDir, gitSHA, localUniqueCorrelationId));

    // clones at "cloneBaseDir/SHA/RANDOMUUID", e.g. "./tmp/59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5/471ff3f9-2ada-48eb-a0f3-3ab70f3f0bdd"
    await gitClone(cloneBaseDir, url, cloneFolder, branch, gitSHA, cloneDepth, c3prLOG5);

    return cloneFolder;

}

module.exports = cloneRepositoryLocally;