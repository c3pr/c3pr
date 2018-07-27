const axios = require('axios').default;
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;

const LOGIN_RETRY_TIME = 5 * 1000;

async function login({loginUrl, username, password, subscriptions, lcid, euuid = 'init?'}) {

    try {
        const {data: jwt} = await axios.post(loginUrl, {username, password, subscriptions});
        c3prLOG4(`Successfully logged in at ${loginUrl}.`, {lcid, euuid});
        return jwt;
    } catch (error) {
        c3prLOG4(`Error while logging in at ${loginUrl}.`, {lcid, euuid, error});
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(login({loginUrl, username, password, subscriptions}));
            }, LOGIN_RETRY_TIME);
        })
    }
}

module.exports = {
    c3prHubClient: {
        login
    }
};