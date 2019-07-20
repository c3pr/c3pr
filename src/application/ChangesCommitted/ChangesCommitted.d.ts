export interface ChangesCommitted {
    project_uuid: string;
    repository: ChangesCommittedRepository;
    changed_files: string[];
    renames: FileRename[];
    source_webhook: any;
}
export interface ChangesCommittedRepository {
    full_path: string;
    push_user: PushUser;
    clone_url_http: string;
    branch: string;
    revision: string;
}
export interface PushUser {
    id: number;
    username: string;
}
export interface FileRename {
    from: string;
    to: string;
}