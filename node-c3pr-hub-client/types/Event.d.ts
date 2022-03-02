export interface Event<T> {
    uuid: string;
    event_type: 'ChangesCommitted' | 'ToolInvocationRequested' | 'ToolInvocationCompleted' | 'PullRequestRequested' | 'PullRequestCreated' | 'PullRequestUpdated',
    meta: {
        status: 'UNPROCESSED' | 'PROCESSING' | 'PROCESSED',
        processor_uuid?: string,
        created: string,
        modified?: string
    },
    payload: T;
}