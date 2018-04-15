const exec = require('child_process').exec;
const c3prLOG = require("node-c3pr-logger");

function sh(command, options): Promise<{error, stdout, stderr}> {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

function replaceTokens(input, replacements) {
    let inputAfterReplacements = input;
    replacements.forEach(({regex, replaceWith}) => {
        inputAfterReplacements = inputAfterReplacements.replace(regex, replaceWith)
    });
    return inputAfterReplacements;
}

const shellLogMeta = {moduleName: 'c3prSH'};

async function c3prSH(shCommand, shOptions, {logMeta, stdout: shouldStdOut, replacements, thirdArgNotProvided} =
                                                         {logMeta: undefined, stdout: undefined, replacements: undefined, thirdArgNotProvided: true}) {
    const r = s => replaceTokens(s, replacements || []);

    if (thirdArgNotProvided) {
        c3prLOG(`WARNING: no third arg provided when SH'ing \`${r(shCommand)}\``, shellLogMeta);
    }

    const logMetaArr = Array.isArray(logMeta) ? logMeta : [logMeta];

    c3prLOG(`\$ ${r(shCommand)}`, ...logMetaArr, shellLogMeta);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        c3prLOG(r(stdout), ...logMetaArr, shellLogMeta);
    }
    if (error) {
        c3prLOG(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            COMMAND: ${r(shCommand)}
            OPTIONS: ${r(JSON.stringify(shOptions))}
            There as an error: ${r(error)}
            ------------------------------
            STDOUT:
            ${r(stdout)}
            ------------------------------
            STDERR:
            ${r(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`,
            ...logMetaArr, shellLogMeta
        );
        throw new Error(r(error));
    }
    return r(stdout);
}

module.exports = c3prSH;