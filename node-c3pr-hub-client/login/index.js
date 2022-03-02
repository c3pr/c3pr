"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const LOGIN_RETRY_TIME = 5 * 1000;
async function c3prHubLogin({ loginUrl, username, password, subscriptions }, c3prLOG5) {
    try {
        const { data: jwt } = await axios_1.default.post(loginUrl, { username, password, subscriptions });
        c3prLOG5(`Successfully logged in on C3PR-HUB (${loginUrl}).`);
        return jwt;
    }
    catch (error) {
        c3prLOG5(`Error while logging in at ${loginUrl}.`, { error });
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(c3prHubLogin({ loginUrl, username, password, subscriptions }, c3prLOG5));
            }, LOGIN_RETRY_TIME);
        });
    }
}
exports.default = c3prHubLogin;
//# sourceMappingURL=index.js.map