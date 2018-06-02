export interface Event<T> {
    uuid: string;
    event_type: "ToolInvocationCompleted" | "PullRequestRequested",
    meta: {
        status: "UNPROCESSED" | "PROCESSING" | "PROCESSED",
        processorUUID?: string,
        created: string,
        modified?: string
    },
    payload: T;
}