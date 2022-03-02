import eventsDB from "../events/eventsDB";

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

function ppu({clone_url_http, command, args}: {clone_url_http: string, command: string, args: {[s: string]: string|number}}) {
    return eventsDB.registerNewEventAsProcessed(ProjectPreferencesUpdated, {
        repository: {clone_url_http},
        command,
        args
    });
}

function updateWeightProjectWide(clone_url_http: string, tool_id: string, weight_modification: number, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE,
        args: {tool_id, weight_modification, reason}
    });
}

function updateWeightPerFile(clone_url_http: string, file_path: string, tool_id: string, weight_modification: number, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE,
        args: {file_path, tool_id, weight_modification, reason}
    });
}

function disableToolProjectWide(clone_url_http: string, tool_id: string, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE,
        args: {tool_id, reason}
    });
}

function disableToolPerFile(clone_url_http: string, file_path: string, tool_id: string, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.DISABLE_TOOL_PER_FILE,
        args: {file_path, tool_id, reason}
    });
}

function enableToolProjectWide(clone_url_http: string, tool_id: string, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE,
        args: {tool_id, reason}
    });
}

function enableToolPerFile(clone_url_http: string, file_path: string, tool_id: string, reason: string = null) {
    return ppu({
        clone_url_http,
        command: PPU_ACTIONS.ENABLE_TOOL_PER_FILE,
        args: {file_path, tool_id, reason}
    });
}

export default {
    updateWeightProjectWide,
    updateWeightPerFile,
    disableToolProjectWide,
    disableToolPerFile,
    enableToolProjectWide,
    enableToolPerFile
}