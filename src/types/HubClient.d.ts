export interface HubClient {
    fetchProjectUuidForCloneUrl(clone_url_http: string): Promise<string>;
}
