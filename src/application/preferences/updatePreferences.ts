import eventsDB from "../events/eventsDB";
import utils from "../../infrastructure/utils";

const UPDATE_WEIGHT_PROJECT_WIDE = 'UPDATE_WEIGHT_PROJECT_WIDE';
const UPDATE_WEIGHT_PER_FILE = 'UPDATE_WEIGHT_PER_FILE';
const DISABLE_TOOL_PROJECT_WIDE = 'DISABLE_TOOL_PROJECT_WIDE';
const DISABLE_TOOL_PER_FILE = 'DISABLE_TOOL_PER_FILE';
const ENABLE_TOOL_PROJECT_WIDE = 'ENABLE_TOOL_PROJECT_WIDE';
const ENABLE_TOOL_PER_FILE = 'ENABLE_TOOL_PER_FILE';

export const PPU_ACTIONS = Object.freeze({
    [UPDATE_WEIGHT_PROJECT_WIDE]: UPDATE_WEIGHT_PROJECT_WIDE,
    [UPDATE_WEIGHT_PER_FILE]: UPDATE_WEIGHT_PER_FILE,
    [DISABLE_TOOL_PROJECT_WIDE]: DISABLE_TOOL_PROJECT_WIDE,
    [DISABLE_TOOL_PER_FILE]: DISABLE_TOOL_PER_FILE,
    [ENABLE_TOOL_PROJECT_WIDE]: ENABLE_TOOL_PROJECT_WIDE,
    [ENABLE_TOOL_PER_FILE]: ENABLE_TOOL_PER_FILE
});

export const ProjectPreferencesUpdated = 'ProjectPreferencesUpdated';

function ppu({project_clone_url, command, args}: {project_clone_url: string, command: string, args: {[s: string]: string|number}}) {
    return {
        project_clone_url,
        uuid: utils.uuid(),
        timestamp: utils.timestamp(),
        event_type: ProjectPreferencesUpdated,
        command,
        args
    };
}

function updateWeightProjectWide(project_clone_url: string, tool_id: string, weight_modification: number) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE,
        args: {tool_id, weight_modification}
    }));
}

function updateWeightPerFile(project_clone_url: string, file_path: string, tool_id: string, weight_modification: number) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE,
        args: {file_path, tool_id, weight_modification}
    }));
}

function disableToolProjectWide(project_clone_url: string, tool_id: string) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE,
        args: {tool_id}
    }));
}

function disableToolPerFile(project_clone_url: string, file_path: string, tool_id: string) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.DISABLE_TOOL_PER_FILE,
        args: {file_path, tool_id}
    }));
}

function enableToolProjectWide(project_clone_url: string, tool_id: string) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE,
        args: {tool_id}
    }));
}

function enableToolPerFile(project_clone_url: string, file_path: string, tool_id: string) {
    return eventsDB.insert(ppu({
        project_clone_url,
        command: PPU_ACTIONS.ENABLE_TOOL_PER_FILE,
        args: {file_path, tool_id}
    }));
}

export default {
    updateWeightProjectWide,
    updateWeightPerFile,
    disableToolProjectWide,
    disableToolPerFile,
    enableToolProjectWide,
    enableToolPerFile
}