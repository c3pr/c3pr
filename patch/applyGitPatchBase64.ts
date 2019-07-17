import * as fs from "fs";
import c3prSH3 from "../src/c3prSH3";
import { v4 as uuidv4 } from  'uuid';
import {PatchDiffBase64} from "./generateGitPatchBase64";

async function applyGitPatchBase64(cloneFolder: string, gitUserName: string, gitUserEmail: string, patch: PatchDiffBase64, c3prLOG5) {
    const patchFileName = `c3pr-${uuidv4()}.patch`;
    const patchFilePath = `${cloneFolder}/${patchFileName}`;

    // const patchContent = Buffer.from(fs.readFileSync('myPatch.patch', 'hex'), 'hex').toString('base64');
    fs.writeFileSync(patchFilePath, Buffer.from(patch.hexBase64, 'base64').toString('hex'), 'hex');

    const userNameNoQuotes = gitUserName.replace(/'/g, '');
    const userEmailNoQuotes = gitUserEmail.replace(/'/g, '');
    await c3prSH3(`git -c user.name='${userNameNoQuotes}' -c user.email='${userEmailNoQuotes}' am --keep-cr --whitespace=fix ${patchFileName}`, {cwd: cloneFolder}, {}, c3prLOG5);
    fs.unlinkSync(patchFilePath);
}

// noinspection JSUnusedGlobalSymbols
export default applyGitPatchBase64;