import * as fs from "fs";
import c3prSH3 from "../src/c3prSH3";
import { v4 as uuidv4 } from  'uuid';
import {PatchDiffBase64} from "./generateGitPatchBase64";

async function applyGitPatchBase64(cloneFolder: string, patch: PatchDiffBase64, {ids}) {
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${cloneFolder}/${patchFileName}`;

    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patch.hexBase64, 'base64').toString('hex'), 'hex');

    await c3prSH3(`git am --keep-cr --whitespace=fix ${patchFileName}`, {cwd: cloneFolder}, {ids});
    fs.unlinkSync(patchFilePath);
}

export default applyGitPatchBase64;