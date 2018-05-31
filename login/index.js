const axios = require('axios');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const LOGIN_RETRY_TIME = 5 * 1000;

async function login({loginUrl, username, password, subscriptions, logMetas: outerLogMetas}) {
    const logMetas = [...(outerLogMetas || []), {nodeName: 'node-c3pr-hub-client', correlationId: 'login', moduleName: 'login'}];

    try {
        const {data: jwt} = await axios.post(loginUrl, {username, password, subscriptions});
        c3prLOG2({
            msg: `Successfully logged in at ${loginUrl}.`,
            logMetas,
        });
        return jwt;
    } catch (e) {
        c3prLOG2({
            msg: `Error while logging in at ${loginUrl}. Reason: '${e}'.`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(login({loginUrl, username, password, subscriptions, logMetas: outerLogMetas}));
            }, LOGIN_RETRY_TIME);
        })
    }
}

module.exports = {
    c3prHubClient: {
        login
    }
};