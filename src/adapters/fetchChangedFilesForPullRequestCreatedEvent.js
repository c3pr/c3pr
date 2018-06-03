const fetchEvent = require('node-c3pr-hub-client/events/fetchEvent');

async function fetchChangedFilesForPullRequestCreatedEvent(pullRequestCreatedEvent) {
    const pullRequestRequestedEvent = await fetchEvent(pullRequestCreatedEvent.parent);
    const toolInvocationCompletedEvent = await fetchEvent(pullRequestRequestedEvent.parent);
    return toolInvocationCompletedEvent.payload.changed_files;
}

module.exports = fetchChangedFilesForPullRequestCreatedEvent;