import config from '../../config';
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';
import createAndEmitPullRequestRequested from "./createAndEmitPullRequestRequested";


export default function handleToolInvocationCompleted(c3prLOG5) {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationCompleted`,
        handlerFunction: createAndEmitPullRequestRequested as any,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}