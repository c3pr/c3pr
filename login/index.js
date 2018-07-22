const axios = require('axios').default;
const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;

const LOGIN_RETRY_TIME = 5 * 1000;

const ids = ['init'];
async function login({loginUrl, username, password, subscriptions}) {

    try {
        const {data: jwt} = await axios.post(loginUrl, {username, password, subscriptions});
        c3prLOG3(`Successfully logged in at ${loginUrl}.`, {ids});
        return jwt;
    } catch (error) {
        c3prLOG3(`Error while logging in at ${loginUrl}.`, {ids, error});
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