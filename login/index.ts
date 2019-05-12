import axios from 'axios';

const LOGIN_RETRY_TIME = 5 * 1000;

interface LoginArgs {
    loginUrl: string;
    username: string;
    password: string;
    subscriptions: string[];
}

export default async function c3prHubLogin({loginUrl, username, password, subscriptions}: LoginArgs, c3prLOG5) {
    try {
        const {data: jwt} = await axios.post(loginUrl, {username, password, subscriptions});
        c3prLOG5(`Successfully logged in on C3PR-HUB (${loginUrl}).`);
        return jwt;
    } catch (error) {
        c3prLOG5(`Error while logging in at ${loginUrl}.`, {error});
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(c3prHubLogin({loginUrl, username, password, subscriptions}, c3prLOG5));
            }, LOGIN_RETRY_TIME);
        })
    }
}
