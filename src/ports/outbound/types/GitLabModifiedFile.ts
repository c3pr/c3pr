export interface GitLabModifiedFile {
    old_path: string;
    new_path: string;
    new_file: boolean;
    renamed_file: boolean;
    deleted_file: boolean;
}