const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://ca35d507f8184162a6f3d3151f3de475@sentry.io/1494586' });

process.on('unhandledRejection', function (err) {
    console.log('unhandledRejection >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const stack = new Error().stack;
    console.log(stack);
    console.log(err);
    console.log('unhandledRejection <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
});

require('./application/login/login');
require('./web/express');