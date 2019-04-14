const fetchEvent = require('node-c3pr-hub-client/events/fetchEvent').fetchEvent;

async function fetchChangedFilesForPullRequestCreatedEvent(pullRequestCreatedEvent) {
    const pullRequestRequestedEvent = await fetchEvent(pullRequestCreatedEvent.payload.parent);
    const toolInvocationCompletedEvent = await fetchEvent(pullRequestRequestedEvent.payload.parent);
    return toolInvocationCompletedEvent.payload.changed_files;
}

export = fetchChangedFilesForPullRequestCreatedEvent;