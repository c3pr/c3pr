import config from '../../../config';
import inboundPorts from "../../../ports/inbound";

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const sha = 'express';
const euuid = sha;

export default function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestRequested' received.`, {lcid, sha, euuid});
        // noinspection JSIgnoredPromiseFromCall
        inboundPorts.handlePullRequestRequested({lcid, sha, euuid});
        response.send('Event received. I will process it, thanks.');
    });

};