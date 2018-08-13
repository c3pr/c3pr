const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const c3prSH3 = require('./c3prSH3').default;
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;


async function createClonesDir({cloneBaseDir, lcid, sha, euuid}) {
    return new Promise(resolve => {
        const resolvedClonesDir = path.resolve(cloneBaseDir);
        if (fs.existsSync(resolvedClonesDir)) {
            c3prLOG4(`${resolvedClonesDir} already exists.`, {lcid, sha, euuid});
            resolve();
        } else {
            c3prLOG4(`${resolvedClonesDir} does not exist, creating.`, {lcid, sha, euuid});
            mkdirp(resolvedClonesDir, () => {
                c3prLOG4(`Clones dir created at ${resolvedClonesDir}`, {lcid, sha, euuid});
                resolve();
            });
        }
    });
}

async function gitClone(cloneBaseDir, repoURL, cloneFolder, branch, gitSHA, cloneDepth, localUniqueCorrelationId, lcid, sha, euuid) {

    await createClonesDir({cloneBaseDir, lcid, sha, euuid});

    c3prLOG4(`Cloning repo ${repoURL}#${gitSHA} at ${cloneFolder}...`, {lcid, sha, euuid, meta: {gitSHA, localUniqueCorrelationId}});

    // clones that single branch (maybe there is a somewhat slightly faster way of doing this with --mirror, though I feel it probably won't pay off)
    await c3prSH3(`git clone --config core.autocrlf=false -b ${branch} --depth ${cloneDepth} --single-branch ${repoURL} ${cloneFolder}`, {}, {lcid, sha, euuid});

    //////////////////////////////////////////////////////////////////////////////////////////////
    //NOTE:
    // the "cloneDepth" depth above is an attempt at not downloading the whole tree
    // if there are too fast too many commits to the branch before this tool clones the repo, then the depth may not
    // be enough. That is, if there are more than "cloneDepth" revisions between the time the webhook was triggered and this clone ran.
    //
    // It should be pretty rare, but in that situation we will get an error like:
    //
    // $ git reset --hard 30b03c1d8aa6ee670534b80edd0dc39c12644259
    // fatal: Could not parse object '30b03c1d8aa6ee670534b80edd0dc39c12644259'.
    //
    // so, maybe later, add a try/catch to retry and increase de depth in case it is not found, if that is even possible.
    // right now, though, I feel the constant "cloneDepth" is pretty much enough.
    //////////////////////////////////////////////////////////////////////////////////////////////

    await c3prSH3(`git reset --hard ${gitSHA}`, {cwd: cloneFolder}, {lcid, sha, euuid});

    c3prLOG4(`Clone/reset completed.`, {lcid, sha, euuid});
}

async function cloneRepositoryLocally({localUniqueCorrelationId, cloneBaseDir, url, branch, revision, cloneDepth, lcid, sha, euuid}) {

    const repoURL = url;
    const gitSHA = revision;
    const cloneFolder = path.resolve(path.join(cloneBaseDir, gitSHA, localUniqueCorrelationId));

    // clones at "cloneBaseDir/SHA/RANDOMUUID", e.g. "./tmp/59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5/471ff3f9-2ada-48eb-a0f3-3ab70f3f0bdd"
    await gitClone(cloneBaseDir, repoURL, cloneFolder, branch, gitSHA, cloneDepth, localUniqueCorrelationId, lcid, sha, euuid);

    return cloneFolder;

}

module.exports = cloneRepositoryLocally;