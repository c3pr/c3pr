import {Event} from 'node-c3pr-hub-client';
import {GitLabMergeRequestCreated} from "../../ports/types/GitLabMergeRequestCreated";
import {createPullRequestCreated} from "./createPullRequestCreated";
import {emitPullRequestCreated} from "./emitPullRequestCreated";


export function createAndEmitPullRequestCreated(pullRequestRequestedEvent: Event<any>, createMrResult: GitLabMergeRequestCreated) {
    const pullRequestCreated = createPullRequestCreated(pullRequestRequestedEvent, createMrResult);
    return emitPullRequestCreated(pullRequestCreated);
}