import {c3prLOG2} from "node-c3pr-logger/c3prLOG2";
import {c3prRNE} from 'node-c3pr-hub-client/events/registerNewEvent';
import config from '../../config';


export function emitPullRequestCreated(pullRequestCreated, outerLogMetas = []) {
    const logMetas = [...outerLogMetas, {nodeName: 'c3pr-repo-gitlab', correlationId: pullRequestCreated.repository.revision, moduleName: 'emitPullRequestCreated'}];

    c3prLOG2({
        msg: `Registering new event of type 'PullRequestCreated' for repository ${pullRequestCreated.repository.clone_url_http} and rev ${pullRequestCreated.repository.revision}.`,
        logMetas,
        meta: {payload: pullRequestCreated}
    });

    return c3prRNE.registerNewEvent({
        event_type: `PullRequestCreated`,
        payload: pullRequestCreated,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        logMetas
    })
        .catch(error => {
            c3prLOG2({msg: `Error while registering new event: PullRequestCreated.`, logMetas, error});
        })
}