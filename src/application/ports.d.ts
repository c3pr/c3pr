interface Agent {
    tool_id: string;
    extensions: string[];
    tags: string[];
    agent_id: string;
    expiration_time: string;
    last_updated: string;
}
declare const ports: {
    fetchAllToolAgents(): Promise<Agent[]>;
    // noinspection JSUnusedLocalSymbols
    shuffleArray<T>(arr: T[]): T[];
    retrieveFilesWithOpenPRs(changes_committed_root: string): string[];
};
export = ports;