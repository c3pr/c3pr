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

import {c3prRepoGitLabLogin} from "./application/login/login";

c3prRepoGitLabLogin().then(() => {
    require('./adapters/inbound/web/express');
});
