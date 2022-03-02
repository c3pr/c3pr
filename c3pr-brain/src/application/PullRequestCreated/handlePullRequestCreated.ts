import config from '../../config';
import handleEventById from "node-c3pr-hub-client/events/handleEventById";
const savePR = require('./savePR');


export default function handlePullRequestCreated(request, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestCreated'});

    return handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction: savePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}
