const fs = require('fs');
const shell = require('./shell');

async function determineGitDiffBase64(correlationId, localUniqueCorrelationId, cloneFolder) {

    const prefix = [correlationId, localUniqueCorrelationId];

    await shell(`git add -A`, {cwd: cloneFolder}, {prefix, scriptName: 'determineGitDiffBase64'});

    const patchFileName = `c3pr-diff-${localUniqueCorrelationId}.patch`;
    const diffFilePath = `${cloneFolder}/${patchFileName}`;

    await shell(`git diff --staged > ${patchFileName}`, {cwd: cloneFolder}, {prefix, scriptName: 'determineGitDiffBase64'});

    // this hex thing is to handle possible ISOvsUTF conflicts in accented diffs
    const diffViaFile = Buffer.from(fs.readFileSync(diffFilePath, 'hex'), 'hex').toString('base64');
    fs.unlinkSync(diffFilePath);

    return diffViaFile;

}

module.exports = determineGitDiffBase64;