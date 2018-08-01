const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const ports = require('../ports');

async function updatePR(pullRequestUpdatedEvent, {lcid, euuid}) {
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(pullRequestUpdatedEvent.payload.repository.clone_url_http);

    let result = await ports.updatePrOfProject(project_uuid, pullRequestUpdatedEvent.payload.pr_id, pullRequestUpdatedEvent.payload.status, pullRequestUpdatedEvent.payload.assignee);
    c3prLOG4(
        `Updated PR ${pullRequestUpdatedEvent.payload.pr_id} in database for project ${pullRequestUpdatedEvent.payload.repository.clone_url_http}`,
        {lcid, euuid, meta: {pullRequestUpdatedEvent, project_uuid}}
    );
    return {new_status: 'PROCESSED', result};
}

module.exports = updatePR;