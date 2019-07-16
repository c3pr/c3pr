import eventsDB from "../events/eventsDB";
import {PPU_ACTIONS} from "./updatePreferences";
import {initPerProject, initPerTool, ProjectPreferences, UpdatePresCommand} from "./ProjectPreferences";

function genPPUCommand(payload): (projectPreferences: ProjectPreferences) => ProjectPreferences {
    switch (payload.command) {
        case PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE:
            return (projectPreferences) => {
                initPerProject(projectPreferences, payload.args.tool_id).weight_modification += payload.args.weight_modification;
                return projectPreferences;
            };
        case PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE:
            return (projectPreferences) => {
                initPerTool(projectPreferences, payload.args.file_path, payload.args.tool_id).weight_modification += payload.args.weight_modification;
                return projectPreferences;
            };
        case PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE:
            return (projectPreferences) => {
                initPerProject(projectPreferences, payload.args.tool_id).enabled = false;
                return projectPreferences;
            };
        case PPU_ACTIONS.DISABLE_TOOL_PER_FILE:
            return (projectPreferences) => {
                initPerTool(projectPreferences, payload.args.file_path, payload.args.tool_id).enabled = false;
                return projectPreferences;
            };
        case PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE:
            return (projectPreferences) => {
                initPerProject(projectPreferences, payload.args.tool_id).enabled = true;
                return projectPreferences;
            };
        case PPU_ACTIONS.ENABLE_TOOL_PER_FILE:
            return (projectPreferences) => {
                initPerTool(projectPreferences, payload.args.file_path, payload.args.tool_id).enabled = true;
                return projectPreferences;
            };
        default:
            throw Error('Unknown PPU command: ' + payload.command);
    }
}

export default async function genPrefsFromPPUs(clone_url_http: string): Promise<UpdatePresCommand[]> {
    const ppus = await eventsDB.findAll({event_type: 'ProjectPreferencesUpdated', 'payload.repository.clone_url_http': clone_url_http});

    return ppus.map(({meta: {created: timestamp}, payload}) => ({apply: genPPUCommand(payload), timestamp}));
}