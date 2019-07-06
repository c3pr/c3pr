const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://8a2c62c0d96d4548a3d0d2918386e24a@sentry.io/1498464' });

const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!agent-init'});

require("./application/login/login")(_c3prLOG5);
require("./web/express")(_c3prLOG5);