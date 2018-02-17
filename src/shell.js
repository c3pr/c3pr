const exec = require('child_process').exec;

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

    console.log(`${(myOptions.prefix || "")} \$ ${r(shCommand)}`);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (myOptions.stdout) {
        console.log((myOptions.prefix || "") + r(stdout));
    }
    if (error) {
        console.log("[ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log((myOptions.prefix || "") + " COMMAND: " + r(shCommand));
        console.log((myOptions.prefix || "") + " OPTIONS: " + r(JSON.stringify(shOptions)));
        console.log((myOptions.prefix || "") + " There as an error: " + r(error));
        console.log("------------------------------");
        console.log(" STDOUT:");
        console.log(r(stdout));
        console.log("------------------------------");
        console.log(" STDERR:");
        console.log(r(stderr));
        console.log("[/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        throw new Error(r(error));
    }
    return r(stdout);
}

module.exports = shell;