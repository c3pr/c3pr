import config from '../../../config';
import inboundPorts from "../../../ports/inbound";

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const euuid = 'express';

export default function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestRequested' received.`, {lcid, euuid});
        // noinspection JSIgnoredPromiseFromCall
        inboundPorts.handlePullRequestRequested({lcid, euuid});
        response.send('Event received. I will process it, thanks.');
    });

};