import config from '../../config';
import updatePR from "./updatePR";
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';



function handlePullRequestUpdated({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `PullRequestUpdated`,
        handlerFunction: updatePR as any,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

export = handlePullRequestUpdated;