import c3prSH3 from "../src/c3prSH3";
import {FileChanges} from "./generateGitPatchBase64";

const fs = require('fs');


async function determineGitDiffBase64Old(correlationId, localUniqueCorrelationId, cloneFolder, ...logMetas) {
    let arrayOfIds = logMetas.map(lm => [...(lm.correlationIds || []), lm.correlationId].filter(i => i));
    let ids = arrayOfIds.reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []);
    return generateGitPatchBase64(cloneFolder, {ids: [correlationId, localUniqueCorrelationId, ...ids]})
}

export interface FileChanges {
    added: string[];
    modified: string[];
    renamed: {from: string, to: string}[];
    deleted: string[];
}
export interface PatchDiffBase64 {
    hexBase64: string;
    plain: string;
    header: string;
    footer: string;
}
export interface GitPatchBase64 {
    files: FileChanges;
    patch: PatchDiffBase64;
}

function extractFileChanges(fileNames):FileChanges {
    return fileNames.trim().split('\n').filter(f => f).reduce((previousValue: FileChanges, currentValue) => {
        switch (currentValue[0]) {
            case 'A':
                previousValue.added.push(currentValue.split(/A +/)[1]);
                break;
            case 'M':
                previousValue.modified.push(currentValue.split(/M +/)[1]);
                break;
            case 'R': {
                let [from, to] = currentValue.split(/R +/)[1].split(' -> ');
                previousValue.renamed.push({from, to});
                break;
            }
            case 'D':
                previousValue.deleted.push(currentValue.split(/D +/)[1]);
                break;
            default:
                previousValue.modified.push(currentValue);
        }
        return previousValue;
    }, {added: [], modified: [], renamed: [], deleted: []});
}

async function generateGitPatchBase64({cloneFolder, gitUserName, gitUserEmail, commitMessage}, {ids}): Promise<GitPatchBase64> {

    await c3prSH3(`git add -A`, {cwd: cloneFolder}, {ids});

    const diffFilePath = `${cloneFolder}/1`;

    // let fileNames = await c3prSH3(`git diff --staged --name-only`, {cwd: cloneFolder}, {ids});
    let fileNames = await c3prSH3(`git status --short`, {cwd: cloneFolder}, {ids});

    if (fileNames.trim() === '') {
        return {files: {added: [], modified: [], renamed: [], deleted: []}, patch: {hexBase64: '', plain: '', header: '', footer: ''}};
    }

    // await c3prSH3(`git diff --staged --ignore-space-change > changes.patch`, {cwd: cloneFolder}, {ids});
    // console.log('\n\n\n\n\n\n');
    // const changes = fs.readFileSync(`${cloneFolder}/changes.patch`, 'utf8');
    // console.log(changes);
    // console.log('\n\n\n\n\n\n');

    // ADD and COMMIT CHANGES
    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await c3prSH3(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {cwd: cloneFolder}, {ids});

    await c3prSH3(`git format-patch --ignore-space-at-eol --numbered-files -n -1 HEAD`, {cwd: cloneFolder}, {ids});

    const plain = fs.readFileSync(diffFilePath, 'utf8');

    // this hex thing is an attempt to convert the file to an string without messing up the encoding
    // const diffViaFile = Buffer.from(fs.readFileSync(diffFilePath, 'utf8')).toString('base64');
    const diffViaFile = Buffer.from(fs.readFileSync(diffFilePath, 'hex'), 'hex').toString('base64');
    const [header, footer] = plain.match(/^[\s\S]*?---|--\s+[\w\d.]+\s+$/g);
    // const [header, footer] = plain.match(/^[\s\S]*?(?=\ndiff)|--\s+[\w\d.]+\s+$/g);
    const files = extractFileChanges(fileNames);

    return {files, patch: {hexBase64: diffViaFile, plain, header, footer}};
}

export default generateGitPatchBase64;