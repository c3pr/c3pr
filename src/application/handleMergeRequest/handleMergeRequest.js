const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;


// TODO check if author is bot
function handleMergeRequest(webhookPayload) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handleMergeRequest'}];

    c3prLOG2({
        msg: `Handling MR update for ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes.title.trim()}'.`,
        logMetas,
        meta: {webhookPayload}
    });

    /*
    look in prsDB for the format expected

    probably you will require some sort of recordin what was the number of the MR created when processing the PullRequestRequested event. Possibly saving it in a
    PullRequestCreated event (which has the ID of the MR).
     */

}

module.exports = handleMergeRequest;