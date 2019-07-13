import eventsDB from "../events/eventsDB";

export interface ToolPreferences {
    weight_modification: number;
    enabled: boolean;
}

export interface ProjectPreferences {
    project_wide: { [tool_id: string]: ToolPreferences };
    per_file: { [file_path: string]: { [tool_id: string]: ToolPreferences } };
}

export default async function calculatePreferences(cloneUrl: string): Promise<ProjectPreferences> {
    const ppus = await eventsDB.findAll({project_clone_url: cloneUrl, event_type: 'ProjectPreferencesUpdated'});

    const prefs: ProjectPreferences = {
        project_wide: {
            // 'tool:a': {
            //     weight_modification: -1
            // },
            // 'tool:b': {
            //     enabled: false
            // }
        },
        per_file: {
            // 'src/main/java/com/example/Main.java': {
            //     'tool:a': {
            //         weight: -10
            //     },
            //     'tool:c': {
            //         enabled: false
            //     }
            // }
        }
    };
    return ppus.reduce((previousValue: ProjectPreferences, currentValue) => {
        switch (currentValue.command) {
            case 'UPDATE_WEIGHT_PROJECT_WIDE':
                previousValue.project_wide[currentValue.arguments.tool_id] = previousValue.project_wide[currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.project_wide[currentValue.arguments.tool_id].weight_modification += currentValue.arguments.amount;
                break;
            case 'UPDATE_WEIGHT_PER_FILE':
                previousValue.per_file[currentValue.arguments.file_path] = previousValue.per_file[currentValue.arguments.file_path] || {};
                    previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id]
                    = previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id].weight_modification += currentValue.arguments.amount;
                break;
            case 'DISABLE_TOOL_PROJECT_WIDE':
                previousValue.project_wide[currentValue.arguments.tool_id] = previousValue.project_wide[currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.project_wide[currentValue.arguments.tool_id].enabled = false;
                break;
            case 'DISABLE_TOOL_PER_FILE':
                previousValue.per_file[currentValue.arguments.file_path] = previousValue.per_file[currentValue.arguments.file_path] || {};
                previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id]
                    = previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id].enabled = false;
                break;
            case 'xENABLE_TOOL_PROJECT_WIDE':
                previousValue.project_wide[currentValue.arguments.tool_id] = previousValue.project_wide[currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.project_wide[currentValue.arguments.tool_id].enabled = true;
                break;
            case 'xENABLE_TOOL_PER_FILE':
                previousValue.per_file[currentValue.arguments.file_path] = previousValue.per_file[currentValue.arguments.file_path] || {};
                previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id]
                    = previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id] || {weight_modification: 0, enabled: true};
                previousValue.per_file[currentValue.arguments.file_path][currentValue.arguments.tool_id].enabled = true;
                break;
            default:
                throw Error('Unknown PPU command: '+currentValue.command);
        }
        return previousValue;
    }, prefs)
}