import {fetchEvent} from "node-c3pr-hub-client/events/fetchEvent";

async function fetchChangedFilesForPullRequestCreatedEvent(pullRequestCreatedEvent) {
    const pullRequestRequestedEvent = await fetchEvent<any>(pullRequestCreatedEvent.payload.parent);
    const toolInvocationCompletedEvent = await fetchEvent<any>(pullRequestRequestedEvent.payload.parent);
    return toolInvocationCompletedEvent.payload.changed_files;
}

export default fetchChangedFilesForPullRequestCreatedEvent;