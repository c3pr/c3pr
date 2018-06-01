const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;


// TODO check if author is bot
function handleMergeRequest(webhookPayload) {
    const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handleMergeRequest'}];

    c3prLOG2({
        msg: `Handling MR update for ${webhookPayload.project.git_http_url}. Message: '${webhookPayload.object_attributes.description.trim()}'.`,
        logMetas,
        meta: {webhookPayload}
    });

}

module.exports = handleMergeRequest;