import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import {c3prRNE} from 'node-c3pr-hub-client/events/registerNewEvent';
import config from '../../config';


export function emitPullRequestCreated(pullRequestCreated, {lcid, euuid}) {
    c3prLOG4(
        `Registering new event of type 'PullRequestCreated' for repository ${pullRequestCreated.repository.clone_url_http} and rev ${pullRequestCreated.repository.revision}.`,
        {lcid, euuid, meta: {payload: pullRequestCreated}}
    );

    return c3prRNE.registerNewEvent({
        event_type: `PullRequestCreated`,
        payload: pullRequestCreated,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        lcid,
        euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: PullRequestCreated.`, {lcid, euuid, error});
    });
}