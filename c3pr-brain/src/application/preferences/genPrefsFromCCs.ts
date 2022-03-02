import eventsDB from "../events/eventsDB";
import {ToolPreferences, UpdatePrefsCommand} from "./ProjectPreferences";

export default async function genPrefsFromCCs(clone_url_http: string): Promise<UpdatePrefsCommand[]> {
    const ccs = await eventsDB.findAll({event_type: 'ChangesCommitted', 'payload.repository.clone_url_http': clone_url_http});
    const commands: UpdatePrefsCommand[] = [];
    for (const {meta: {created}, payload: {renames}} of ccs) {
        commands.push(...genCommandsForCC(renames, created));
    }
    return commands;
}

function genCommandsForCC(renames: {from: string, to: string}[] = [], timestamp: string): UpdatePrefsCommand[] {
    const commands: UpdatePrefsCommand[] = [];
    for (const {from, to} of renames) {
        commands.push({
            apply: (projectPreferences) => {
                if (projectPreferences.open_prs[from]) {
                    projectPreferences.open_prs[to] = mergeOpenPRs(projectPreferences.open_prs[from], projectPreferences.open_prs[to]);
                    delete projectPreferences.open_prs[from];
                }
                if (projectPreferences.per_file[from]) {
                    projectPreferences.per_file[to] = mergeToolPreferencesMaps(projectPreferences.per_file[from], projectPreferences.per_file[to]);
                    delete projectPreferences.per_file[from];
                }
                return projectPreferences;
            },
            timestamp
        })
    }
    return commands;
}

function mergeOpenPRs(prs_from: number[], prs_to: number[] = []): number[] {
    return prs_to.concat(prs_from);
}

type ToolPreferencesMap = { [tool_id: string]: ToolPreferences };

function mergeToolPreferencesMaps(prefs_from: ToolPreferencesMap, prefs_to: ToolPreferencesMap = {}): ToolPreferencesMap {
    Object.entries(prefs_from).forEach(([tool_id, toolPreferences]: [string, ToolPreferences]) => {
        prefs_to[tool_id] = mergeToolPreferences(toolPreferences, prefs_to[tool_id]);
    });
    return prefs_to;
}

function mergeToolPreferences(fromPreferences: ToolPreferences, toPreferences: ToolPreferences) {
    if (toPreferences === undefined) {
        return fromPreferences;
    }
    return {
        enabled: fromPreferences.enabled && toPreferences.enabled,
        weight_modification: fromPreferences.weight_modification + toPreferences.weight_modification,
    };
}
