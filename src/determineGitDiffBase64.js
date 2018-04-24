const fs = require('fs');
const c3prSH = require('./c3prSH');

async function determineGitDiffBase64(correlationId, localUniqueCorrelationId, cloneFolder, ...logMetas) {

    const determineGitDiffBase64LogMeta = {correlationIds: [correlationId, localUniqueCorrelationId], moduleName: 'determineGitDiffBase64'};
    const logMeta = [...logMetas, determineGitDiffBase64LogMeta];

    await c3prSH(`git add -A`, {cwd: cloneFolder}, {logMeta});

    const patchFileName = `c3pr-diff-${localUniqueCorrelationId}.patch`;
    const diffFilePath = `${cloneFolder}/${patchFileName}`;

    let fileNames = await c3prSH(`git diff --staged --name-only`, {cwd: cloneFolder, stdout: true}, {logMeta, stdout: true});

    await c3prSH(`git diff --staged > ${patchFileName}`, {cwd: cloneFolder}, {logMeta});

    // this hex thing is to handle possible ISOvsUTF conflicts in accented diffs
    const diffViaFile = Buffer.from(fs.readFileSync(diffFilePath, 'hex'), 'hex').toString('base64');
    fs.unlinkSync(diffFilePath);

    return {files: fileNames.trim().split('\n'), diff: diffViaFile};

}

module.exports = determineGitDiffBase64;