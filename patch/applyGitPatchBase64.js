"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const c3prSH3_1 = require("../src/c3prSH3");
const uuid_1 = require("uuid");
async function applyGitPatchBase64(cloneFolder, patch, { ids }) {
    const patchFileName = `c3pr-${uuid_1.v4()}.patch`;
    const patchFilePath = `${cloneFolder}/${patchFileName}`;
    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patch.hexBase64, 'base64').toString('hex'), 'hex');
    await c3prSH3_1.default(`git am --keep-cr --whitespace=fix ${patchFileName}`, { cwd: cloneFolder }, { ids });
    fs.unlinkSync(patchFilePath);
}
exports.default = applyGitPatchBase64;
//# sourceMappingURL=applyGitPatchBase64.js.map