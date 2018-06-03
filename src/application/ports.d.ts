import {Event, PR} from 'node-c3pr-hub-client';
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
    shuffleArray<T>(ignored: T[]): T[];
    retrieveFilesWithOpenPRs(changes_committed_root: string): string[];
    fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string>;
    fetchChangedFilesForPullRequestCreatedEvent(pullRequestCreatedEvent: Event<any>): string[];
    postNewPrForProject(project_uuid: string, pr: Partial<PR>): Promise<any>
};
export = ports;