import config from '../../config';
import handleEventById from 'node-c3pr-hub-client/events/handleEventById';
import createAndEmitPullRequestRequested from "./createAndEmitPullRequestRequested";


export default function handleToolInvocationCompleted(request, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handleToolInvocationCompleted'});

    return handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction: createAndEmitPullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}