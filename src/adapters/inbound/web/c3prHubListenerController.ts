import config from '../../../config';
import inboundPorts from "../../../ports/inbound";
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

export default function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: '!express-repo-gitlab'});
        _c3prLOG5(`'PullRequestRequested' received.`);
        // noinspection JSIgnoredPromiseFromCall
        inboundPorts.handlePullRequestRequested({..._c3prLOG5});
        response.send('Event received. I will process it, thanks.');
    });

};