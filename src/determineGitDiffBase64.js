const fs = require('fs');
const shell = require('./shell');

async function determineGitDiffBase64(correlationId, localUniqueCorrelationId, cloneFolder, ...logMetas) {

    const determineGitDiffBase64LogMeta = {correlationIds: [correlationId, localUniqueCorrelationId], moduleName: 'determineGitDiffBase64'};
    const logMeta = [...logMetas, determineGitDiffBase64LogMeta];

    await shell(`git add -A`, {cwd: cloneFolder}, {logMeta});

    const patchFileName = `c3pr-diff-${localUniqueCorrelationId}.patch`;
    const diffFilePath = `${cloneFolder}/${patchFileName}`;

    await shell(`git diff --staged > ${patchFileName}`, {cwd: cloneFolder}, {logMeta});

    // this hex thing is to handle possible ISOvsUTF conflicts in accented diffs
    const diffViaFile = Buffer.from(fs.readFileSync(diffFilePath, 'hex'), 'hex').toString('base64');
    fs.unlinkSync(diffFilePath);

    return diffViaFile;

}

module.exports = determineGitDiffBase64;