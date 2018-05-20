const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prCEAMAP = require('node-c3pr-hub-client/events/collectEventAndMarkAsProcessing').c3prCEAMAP;

const createAndEmitPullRequestRequested = require('../PullRequestRequested/createAndEmitPullRequestRequested');

const config = require('../../config');

const logMeta = {nodeName: 'c3pr-brain', moduleName: 'handleToolInvocationCompleted'};

function handleToolInvocationCompleted() {
    c3prLOG2({msg: `Handling ToolInvocationCompleted.`, logMetas: [logMeta]});

    c3prCEAMAP.collectEventAndMarkAsProcessing(
        {eventType: `ToolInvocationCompleted`, c3prHubUrl: config.c3pr.hub.c3prHubUrl, jwt: config.c3pr.jwt, logMetas: [logMeta]}
    ).catch((e) => {
        c3prLOG2({msg: `Couldn't collect ToolInvocationCompleted. Skipping.`, logMetas: [logMeta], meta: {error: require('util').inspect(e)}});
    }).then((toolInvocationCompleted) => {
        if (!toolInvocationCompleted) {
            c3prLOG2({msg: `No ToolInvocationCompleted collected (possibly due to concurrent attempts to collect the same event). Skipping.`, logMetas, meta: {toolInvocationCompleted}});
            return;
        }
        createAndEmitPullRequestRequested(toolInvocationCompleted);
    });
}



module.exports = {
    c3pr: {
        handleToolInvocationCompleted
    }
};