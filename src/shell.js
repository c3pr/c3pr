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

    log.info((myOptions.prefix || ""), 'shell', `\$ ${r(shCommand)}`);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (myOptions.stdout) {
        log.info((myOptions.prefix || ""), 'shell', r(stdout));
    }
    if (error) {
        log.info((myOptions.prefix || ""), 'shell',`
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