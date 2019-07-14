import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";

export default async function updatePR(pullRequestUpdatedEvent, {lcid, sha, euuid}) {
    const project_uuid = await fetchFirstProjectForCloneUrl(pullRequestUpdatedEvent.payload.repository.clone_url_http);

    let result = await updatePrOfProject(project_uuid, pullRequestUpdatedEvent.payload.pr_id, pullRequestUpdatedEvent.payload.status, pullRequestUpdatedEvent.payload.assignee);
    c3prLOG4(
        `Updated PR ${pullRequestUpdatedEvent.payload.pr_id} in database for project ${pullRequestUpdatedEvent.payload.repository.clone_url_http}`,
        {lcid, sha, euuid, meta: {pullRequestUpdatedEvent, project_uuid}}
    );
    return {new_status: 'PROCESSED', result};
}
