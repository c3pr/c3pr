const axios = require('axios');

const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const config = require('../config');

const logMetas = [{nodeName: 'c3pr-repo-gitlab', correlationId: 'boot', moduleName: 'login'}];

axios.post(config.c3pr.loginUrl, {eventType: "pr", callbackUrl: config.c3pr.prsUrl}).then(({data: jwt}) => {
    config.c3pr.jwt = jwt;

    c3prLOG2({
        msg: `Successfully logged-in at ${config.c3pr.loginUrl}.`,
        logMetas,
    });

}).catch(e => {
    c3prLOG2({
        msg: `Error while logging in at ${config.c3pr.loginUrl}. Probably nothing will work. Reason: '${e}'.`,
        logMetas,
        meta: {error: require('util').inspect(e)}
    });
});