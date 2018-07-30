import {Event} from 'node-c3pr-hub-client';
import {GitLabMergeRequestCreated} from "../../ports/outbound/types/GitLabMergeRequestCreated/GitLabMergeRequestCreated";
import {createPullRequestCreated} from "./createPullRequestCreated";
import {emitPullRequestCreated} from "./emitPullRequestCreated";


export function createAndEmitPullRequestCreated(pullRequestRequestedEvent: Event<any>, createMrResult: GitLabMergeRequestCreated, {lcid, euuid}) {
    const pullRequestCreated = createPullRequestCreated(pullRequestRequestedEvent, createMrResult);
    return emitPullRequestCreated(pullRequestCreated, {lcid, euuid});
}