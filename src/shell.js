const exec = require('child_process').exec;
const log = require("node-c3pr-logger").log;

function sh(command, options) {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

function replaceTokens(input, replacements) {
    let inputAfterReplacements = input;
    replacements.forEach(replacement => {
        inputAfterReplacements = inputAfterReplacements.replace(replacement.regex, replacement.replaceWith)
    });
    return inputAfterReplacements;
}

async function shell(shCommand, shOptions, myOptions = {}) {
    const r = s => replaceTokens(s, myOptions.replacements || []);

    let prefix = myOptions.prefix || "";
    let scriptName = myOptions.scriptName || 'shell';
    if (!Array.isArray(prefix)) {
        prefix = [prefix];
    }

    log.info(prefix, scriptName, `\$ ${r(shCommand)}`);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (myOptions.stdout) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        log.info(prefix, scriptName, r(stdout));
    }
    if (error) {
        log.info(prefix, scriptName,`
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
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`
        );
        throw new Error(r(error));
    }
    return r(stdout);
}

module.exports = shell;