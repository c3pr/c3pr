import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
const ports = require('../ports');

async function savePR(pullRequestCreatedEvent, {lcid, sha, euuid}) {
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(pullRequestCreatedEvent.payload.repository.clone_url_http);
    const changed_files = await ports.fetchChangedFilesForPullRequestCreatedEvent(pullRequestCreatedEvent);

    const pr = {
        project_uuid,
        pr_id: pullRequestCreatedEvent.payload.pr_id,
        pr_url: pullRequestCreatedEvent.payload.pr_url,
        PullRequestRequested: pullRequestCreatedEvent.payload.parent.uuid,
        changed_files,
        assignee: pullRequestCreatedEvent.payload.assignee
    };

    let result = await ports.postNewPrForProject(project_uuid, pr);
    c3prLOG4(`Created PR in database for ${pullRequestCreatedEvent.payload.pr_url}`, {lcid, sha, euuid, meta: {pullRequestCreatedEvent, project_uuid, changed_files}});
    return {new_status: 'PROCESSED', result};
}

export = savePR;