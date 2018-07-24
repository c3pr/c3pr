require('./application/events/events').init.then(() => {
    return require('./application/agentRegistry/agentRegistry').init;
}).then(() => {
    require('./web/express');
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const stack = new Error().stack;
    console.log(stack);
    console.log(err);
    console.log('uncaughtException <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
});

process.on('UnhandledPromiseRejectionWarning', function (err) {
    console.log('UnhandledPromiseRejectionWarning >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const stack = new Error().stack;
    console.log(stack);
    console.log(err);
    console.log('UnhandledPromiseRejectionWarning <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
});
