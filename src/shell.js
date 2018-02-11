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
        console.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.error((myOptions.prefix || "") + "COMMAND: " + shCommand);
        console.error((myOptions.prefix || "") + "OPTIONS: " + JSON.stringify(shOptions));
        console.error((myOptions.prefix || "") + "There as an error: " + error);
        console.error("------------------------------");
        console.error("STDOUT:");
        console.error(stdout);
        console.error("------------------------------");
        console.error("STDERR:");
        console.error(stderr);
        console.error("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        throw new Error(error);
    }
    return stdout;
}

module.exports = {
    shell, shellOut
};