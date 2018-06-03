const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3prLOG2;
const ports = require('../ports');

async function updatePR(pullRequestUpdatedEvent) {
    const project_uuid = await ports.fetchFirstProjectForCloneUrl(pullRequestUpdatedEvent.payload.repository.clone_url_http);

    let result = await ports.updatePrOfProject(project_uuid, pullRequestUpdatedEvent.payload.pr_id, pullRequestUpdatedEvent.payload.status, pullRequestUpdatedEvent.payload.assignee);
    c3prLOG2({
        msg: `Updated PR ${pullRequestUpdatedEvent.payload.pr_id} in database for project ${pullRequestUpdatedEvent.payload.repository.clone_url_http}`,
        logMetas: [{nodeName: 'c3pr-brain', moduleName: 'updatePR'}],
        meta: {pullRequestUpdatedEvent, project_uuid}
    });
    return {new_status: 'PROCESSED', result};
}

module.exports = updatePR;