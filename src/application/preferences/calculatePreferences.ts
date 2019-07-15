import eventsDB from "../events/eventsDB";
import {PPU_ACTIONS} from "./updatePreferences";

export interface ToolPreferences {
    weight_modification: number;
    enabled: boolean;
}

export interface ProjectPreferences {
    project_wide: { [tool_id: string]: ToolPreferences };
    per_file: { [file_path: string]: { [tool_id: string]: ToolPreferences } };
}

const defaultPreferences = () => ({weight_modification: 0, enabled: true});

function initPerProject(previousValue: ProjectPreferences, toolId) {
    previousValue.project_wide[toolId] = previousValue.project_wide[toolId] || defaultPreferences();
}

function initPerTool(previousValue: ProjectPreferences, filePath, toolId) {
    previousValue.per_file[filePath] = previousValue.per_file[filePath] || {};
    previousValue.per_file[filePath][toolId] = previousValue.per_file[filePath][toolId] || defaultPreferences();
}

export default async function calculatePreferences(cloneUrl: string): Promise<ProjectPreferences> {
    const ppus = await eventsDB.findAll({project_clone_url: cloneUrl, event_type: 'ProjectPreferencesUpdated'});

    const prefs: ProjectPreferences = {project_wide: {}, per_file: {}};

    return ppus.reduce((previousValue: ProjectPreferences, {payload}) => {
        switch (payload.command) {
            case PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE:
                initPerProject(previousValue, payload.args.tool_id);
                previousValue.project_wide[payload.args.tool_id].weight_modification += payload.args.weight_modification;
                break;
            case PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE:
                initPerTool(previousValue, payload.args.file_path, payload.args.tool_id);
                previousValue.per_file[payload.args.file_path][payload.args.tool_id].weight_modification += payload.args.weight_modification;
                break;
            case PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE:
                initPerProject(previousValue, payload.args.tool_id);
                previousValue.project_wide[payload.args.tool_id].enabled = false;
                break;
            case PPU_ACTIONS.DISABLE_TOOL_PER_FILE:
                initPerTool(previousValue, payload.args.file_path, payload.args.tool_id);
                previousValue.per_file[payload.args.file_path][payload.args.tool_id].enabled = false;
                break;
            case PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE:
                initPerProject(previousValue, payload.args.tool_id);
                previousValue.project_wide[payload.args.tool_id].enabled = true;
                break;
            case PPU_ACTIONS.ENABLE_TOOL_PER_FILE:
                initPerTool(previousValue, payload.args.file_path, payload.args.tool_id);
                previousValue.per_file[payload.args.file_path][payload.args.tool_id].enabled = true;
                break;
            default:
                throw Error('Unknown PPU command: '+payload.command);
        }
        return previousValue;
    }, prefs)
}