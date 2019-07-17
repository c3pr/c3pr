"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const c3prLOG5_1 = require("node-c3pr-logger/c3prLOG5");
function sh(command, options) {
    return new Promise((resolve => {
        child_process_1.exec(command, options, function (error, stdout, stderr) {
            resolve({ error, stdout, stderr });
        });
    }));
}
function replaceTokens(input, replacements) {
    let inputAfterReplacements = input;
    replacements.forEach(({ regex, replaceWith }) => {
        inputAfterReplacements = inputAfterReplacements.replace(regex, replaceWith);
    });
    return inputAfterReplacements;
}
async function c3prSH3(shCommand, shOptions = {}, { lcid, sha, euuid, level: outerLevel, stdout: shouldStdOut = false, replacements }, _c3prLOG5) {
    const level = (outerLevel || 0) + 1;
    const __c3prLOG5 = _c3prLOG5 || c3prLOG5_1.default({ lcid, sha, euuid });
    const ___c3prLOG5 = __c3prLOG5({ level });
    const hideTokens = s => replaceTokens(s, replacements || []);
    ___c3prLOG5(`\$ ${hideTokens(shCommand)}`);
    let { error, stdout, stderr } = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        ___c3prLOG5(hideTokens(stdout));
    }
    if (error) {
        ___c3prLOG5(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        
            -- SHELL COMMAND FAILED --
            
            COMMAND: ${hideTokens(shCommand)}
            OPTIONS: ${hideTokens(JSON.stringify(shOptions))}
            There as an error: ${hideTokens(error)}
            ------------------------------
            STDOUT:
            ${hideTokens(stdout)}
            ------------------------------
            STDERR:
            ${hideTokens(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
        throw new Error(hideTokens(error));
    }
    return (hideTokens(stdout) || '').trim();
}
exports.default = c3prSH3;
//# sourceMappingURL=c3prSH3.js.map