"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const c3prLOG3_1 = require("node-c3pr-logger/c3prLOG3");
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
async function c3prSH3(shCommand, shOptions = {}, { ids = [], stdout: shouldStdOut = false, replacements } = {}) {
    const hideTokens = s => replaceTokens(s, replacements || []);
    c3prLOG3_1.default(`\$ ${hideTokens(shCommand)}`, { ids });
    let { error, stdout, stderr } = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        c3prLOG3_1.default(hideTokens(stdout), { ids });
    }
    if (error) {
        c3prLOG3_1.default(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            COMMAND: ${hideTokens(shCommand)}
            OPTIONS: ${hideTokens(JSON.stringify(shOptions))}
            There as an error: ${hideTokens(error)}
            ------------------------------
            STDOUT:
            ${hideTokens(stdout)}
            ------------------------------
            STDERR:
            ${hideTokens(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`, { ids });
        throw new Error(hideTokens(error));
    }
    return (hideTokens(stdout) || '').trim();
}
// noinspection JSUnusedGlobalSymbols
exports.default = c3prSH3;
//# sourceMappingURL=c3prSH3.js.map