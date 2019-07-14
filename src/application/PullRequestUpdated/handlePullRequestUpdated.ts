import config from '../../config';
import updatePR from "./updatePR";
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';


export default function handlePullRequestUpdated(c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestUpdated'});
    return handleFirstCollectedEvent({
            event_type: `PullRequestUpdated`,
            handlerFunction: updatePR as any,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        c3prLOG5
    );
}