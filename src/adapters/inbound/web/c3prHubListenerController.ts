import config from '../../../config';
import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import inboundPorts from "../../../ports/inbound";


const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'c3prHubListenerController'}];

export default function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'PullRequestRequested' received.`, logMetas});
        // noinspection JSIgnoredPromiseFromCall
        inboundPorts.handlePullRequestRequested();
        response.send('Event received. I will process it, thanks.');
    });

};