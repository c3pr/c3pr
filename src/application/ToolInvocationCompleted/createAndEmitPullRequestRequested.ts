import invokeToolsForRemainingFiles from "./invokeToolsForRemainingFiles";
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

const createPullRequestRequested = require('../PullRequestRequested/createPullRequestRequested').c3pr.createPullRequestRequested;
const emitPullRequestRequested = require('../PullRequestRequested/emitPullRequestRequested');


export default function createAndEmitPullRequestRequested(toolInvocationCompletedEvent, {lcid, sha, euuid}): {new_status, result} {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid});
    let result: any = {};
    if (toolInvocationCompletedEvent.payload.unmodified_files.length) {
        _c3prLOG5(`ToolInvocationCompleted has unmodified files. I will now attempt to invoke new tools.`, {meta: {toolInvocationCompletedEvent}});
        result.newToolInvocation = invokeToolsForRemainingFiles(toolInvocationCompletedEvent, _c3prLOG5);
    }

    if (toolInvocationCompletedEvent.payload.changed_files.length) {
        _c3prLOG5(`ToolInvocationCompleted modified files. I will now issue a PullRequestRequested event.`, {meta: {toolInvocationCompletedEvent}});
        const pullRequestRequested = createPullRequestRequested(toolInvocationCompletedEvent);
        result.prEmitted = emitPullRequestRequested(pullRequestRequested, {lcid, sha, euuid});
    }

    return {new_status: 'PROCESSED', result};
}
