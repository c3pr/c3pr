const exec = require('child_process').exec;
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
function sh(command, options) {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
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
async function c3prSH(shCommand, shOptions, { lcid, euuid, logMeta, stdout: shouldStdOut, replacements, thirdArgNotProvided } = { lcid: undefined, euuid: undefined, logMeta: undefined, stdout: undefined, replacements: undefined, thirdArgNotProvided: true }) {
    const r = s => replaceTokens(s, replacements || []);
    if (thirdArgNotProvided) {
        c3prLOG4(`WARNING: no third arg provided when SH'ing \`${r(shCommand)}\``, { lcid: 'c3prSH', euuid: 'c3prSH' });
    }
    const logMetaArr = Array.isArray(logMeta) ? logMeta : [logMeta];
    c3prLOG4(`\$ ${r(shCommand)}`, { lcid, euuid, logMeta: logMetaArr });
    let { error, stdout, stderr } = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        c3prLOG4(r(stdout), { lcid, euuid, logMeta: logMetaArr });
    }
    if (error) {
        c3prLOG4(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            
            -- SHELL COMMAND FAILED --
            
            COMMAND: ${r(shCommand)}
            OPTIONS: ${r(JSON.stringify(shOptions))}
            There as an error: ${r(error)}
            ------------------------------
            STDOUT:
            ${r(stdout)}
            ------------------------------
            STDERR:
            ${r(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`, { lcid, euuid, logMeta: logMetaArr, error });
        throw new Error(r(error));
    }
    return r(stdout);
}
module.exports = c3prSH;
//# sourceMappingURL=c3prSH.js.map