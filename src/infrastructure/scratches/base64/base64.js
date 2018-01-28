const fs = require('fs');
const path = require('path');

const patchFile = path.join(__dirname, 'viaGitDiffGreaterThan.patch');
const afterPatchFile = path.join(__dirname, 'viaEchoAFTER.patch');
console.log(patchFile);

const fileAsString = fs.readFileSync(patchFile, 'hex');
console.log(fileAsString.toString());
console.log('\n');

const fileAsBase64 = Buffer.from(fileAsString, 'hex').toString('base64');

console.log(fileAsBase64);
console.log('\n');

const fileAsStringBackFromBase64 = Buffer.from(fileAsBase64, 'base64').toString('hex');

console.log(fileAsStringBackFromBase64);
console.log('\n');

fs.writeFileSync(afterPatchFile, fileAsStringBackFromBase64, 'hex');