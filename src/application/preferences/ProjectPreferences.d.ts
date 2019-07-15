export interface ToolPreferences {
    enabled: boolean;
    weight_modification?: number;
    reason?: string;
}

export interface ProjectPreferences {
    project_wide: { [all_tools_OR_tool_id: string]: ToolPreferences };
    per_file: { [file_path: string]: { [all_tools_OR_tool_id: string]: ToolPreferences } };
}