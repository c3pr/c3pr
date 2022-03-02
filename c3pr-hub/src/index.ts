//////////// BEGIN ERROR TRACING CODE
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.C3PR_SENTRY_DSN, serverName: require('os').hostname() });

process.on('unhandledRejection', function (err) {
    Sentry.captureException(err);
    console.log('unhandledRejection >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const stack = new Error().stack;
    console.log(stack);
    console.log(err);
    console.log('unhandledRejection <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
});

process.on('uncaughtException', function (err) {
    Sentry.captureException(err);
    console.log('uncaughtException >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const stack = new Error().stack;
    console.log(stack);
    console.log(err);
    console.log('uncaughtException <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
});
//////////// END ERROR TRACING CODE


require('./application/events/events').init.then(() => {
    return require('./application/agentRegistry/agentRegistry').init;
}).then(() => {
    require('./web/express');
});