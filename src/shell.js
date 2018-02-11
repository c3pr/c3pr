const exec = require('child_process').exec;

function sh(command, options) {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

async function shell(shCommand, shOptions, myOptions = {}) {
    console.log(`${(myOptions.prefix || "")} \$ ${shCommand}`);
    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (myOptions.stdout) {
        console.log((myOptions.prefix || "") + stdout);
    }
    if (error) {
        console.log("[ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log((myOptions.prefix || "") + " COMMAND: " + shCommand);
        console.log((myOptions.prefix || "") + " OPTIONS: " + JSON.stringify(shOptions));
        console.log((myOptions.prefix || "") + " There as an error: " + error);
        console.log("------------------------------");
        console.log(" STDOUT:");
        console.log(stdout);
        console.log("------------------------------");
        console.log(" STDERR:");
        console.log(stderr);
        console.log("[/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        throw new Error(error);
    }
    return stdout;
}

module.exports = shell;