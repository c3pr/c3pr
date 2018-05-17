const createPullRequestRequested = require('../PullRequestRequested/createPullRequestRequested').c3pr.createPullRequestRequested;
const emitPullRequestRequested = require('../PullRequestRequested/emitPullRequestRequested');

function createAndEmitPullRequestRequested(toolInvocationCompleted, logMetas) {
    const pullRequestRequested = createPullRequestRequested(toolInvocationCompleted);
    emitPullRequestRequested(pullRequestRequested, logMetas);
}

module.exports = createAndEmitPullRequestRequested;
