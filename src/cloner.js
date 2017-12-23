const clone = require('git-clone');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const CLONES_DIR = path.resolve(process.env.CLONES_DIR || '/tmp');

async function createClonesDir() {
    return new Promise(resolve => {
        const resolvedClonesDir = path.resolve(CLONES_DIR);
        if (fs.existsSync(resolvedClonesDir)) {
            console.log(resolvedClonesDir + " already exists.");
            resolve();
        } else {
            console.log(resolvedClonesDir + " does not exist, creating.");
            mkdirp(resolvedClonesDir, () => {
                console.log("Clones dir created at " + resolvedClonesDir);
                resolve();
            });
        }
    });
}


async function gitClone(repo, targetPath, gitSHA) {
    await createClonesDir();
    const resolvedTargetPath = path.resolve(targetPath);
    return new Promise((resolve, reject) => {
        console.log("Cloning repo " + repo + "#" + gitSHA + " at " + resolvedTargetPath + "...");
        clone(repo, resolvedTargetPath, {shallow: true, checkout: gitSHA}, (error) => {
            if (error) {
                reject(error);
            } else {
                console.log("Clone completed.");
                resolve();
            }
        })
    });
}

module.exports = async function (request) {

    const repoURL = request.repository.url;
    const gitSHA = request.repository.revision;
    const cloneFOLDER = path.join(CLONES_DIR, gitSHA);

    // clones at "CLONES_DIR/SHA", e.g. "./tmp/59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5"
    await gitClone(repoURL, cloneFOLDER, gitSHA);

    exec('ls -la', {
        cwd: cloneFOLDER
    }, function(error, stdout, stderr) {
        console.error(error);
        console.log(stdout);
        console.error(stderr);
    });

};