export const WEIGHT_MODIFICATION_PER_MERGED_PR = -1; // lower is better
export const WEIGHT_MODIFICATION_PER_CLOSED_PR = 1;

export interface ToolPreferences {
    enabled: boolean;
    weight_modification?: number;
}

export interface ProjectPreferences {
    project_wide: { [tool_id: string]: ToolPreferences };
    per_file: { [file_path: string]: { [tool_id: string]: ToolPreferences } };
    open_prs: { [file_path: string]: number[] };
}

export interface UpdatePrefsCommand {
    apply: (projectPreferences: ProjectPreferences) => ProjectPreferences;
    timestamp: string;
    // event_uuid: string;
}

const defaultPreferences = () => ({enabled: true, weight_modification: 0});

export function initPerProject(prefs: ProjectPreferences, tool_id: string) {
    prefs.project_wide[tool_id] = prefs.project_wide[tool_id] || defaultPreferences();
    return prefs.project_wide[tool_id];
}

export function initPerTool(prefs: ProjectPreferences, file_path: string, tool_id: string) {
    prefs.per_file[file_path] = prefs.per_file[file_path] || {};
    prefs.per_file[file_path][tool_id] = prefs.per_file[file_path][tool_id] || defaultPreferences();
    return prefs.per_file[file_path][tool_id];
}
