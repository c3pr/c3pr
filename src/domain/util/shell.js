const exec = require('child_process').exec;

function sh(command, options) {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

async function shell(shCommand, shOptions, myOptions = {}) {
    try {
        await shellOut(shCommand, shOptions, myOptions)
    } catch (e) {
        /* Swallow error, as it has already been printed to console. */
    }
}

async function shellOut(shCommand, shOptions, myOptions = {}) {
    console.log(`${(myOptions.prefix || "")} \$ ${shCommand}`);
    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (myOptions.stdout) {
        console.log((myOptions.prefix || "") + stdout);
    }
    if (error) {
        console.err(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.err((myOptions.prefix || "") + "COMMAND: " + shCommand);
        console.err((myOptions.prefix || "") + "OPTIONS: " + JSON.stringify(shOptions));
        console.err((myOptions.prefix || "") + "There as an error: " + error);
        console.err("------------------------------");
        console.err("STDOUT:");
        console.err(stdout);
        console.err("------------------------------");
        console.err("STDERR:");
        console.err(stderr);
        console.err("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        throw new Error(error);
    }
    return stdout;
}

module.exports = {
    shell, shellOut
};