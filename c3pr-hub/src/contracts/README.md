| Event                     | Emitted by       | Consumed By
| ------------------------- | ---------------- | ---
| `ChangesCommitted`        | c3pr-repo-gitXYZ | **c3pr-brain**
| `ToolInvocationRequested` | **c3pr-brain**   | *tool-agent*
| `ToolInvocationCompleted` | *tool-agent*     | **c3pr-brain**
| `PullRequestRequested`    | **c3pr-brain**   | c3pr-repo-gitXYZ
| `PullRequestUpdated`      | c3pr-repo-gitXYZ | **c3pr-brain**