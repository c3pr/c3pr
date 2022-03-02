import {initPerProject, initPerTool, UpdatePrefsCommand} from "./ProjectPreferences";

export function modifyWeightOfToolForAllFiles(files: string[], tool_id: string, timestamp: string, weight_modification: number): UpdatePrefsCommand[] {
    return files.map(file => ({
        apply: (projectPreferences) => {
            const toolPreferencesForFile = initPerTool(projectPreferences, file, tool_id);
            toolPreferencesForFile.weight_modification += weight_modification;
            if (toolPreferencesForFile.enabled && toolPreferencesForFile.weight_modification === 0) {
                // back to default, we remove tool entry for file
                delete projectPreferences.per_file[file][tool_id];
            }
            if (Object.keys(projectPreferences.per_file[file]).length === 0) {
                // back to default, we remove file entry
                delete projectPreferences.per_file[file];
            }
            return projectPreferences;
        },
        timestamp
    }));
}

export function removePrFromOpenPrsForFile(files: string[], pr_id: number, timestamp: string): UpdatePrefsCommand[] {
    return files.map(file => ({
        apply: (projectPreferences) => {
            projectPreferences.open_prs[file] = projectPreferences.open_prs[file] || [];
            projectPreferences.open_prs[file] = projectPreferences.open_prs[file].filter(pid => pid !== pr_id);
            if (!projectPreferences.open_prs[file].length) delete projectPreferences.open_prs[file];
            return projectPreferences;
        },
        timestamp
    }));
}


export function disableToolForProject(tool_id: string, timestamp: string) {
    return [{
        apply: (projectPreferences) => {
            initPerProject(projectPreferences, tool_id).enabled = false;
            return projectPreferences;
        },
        timestamp
    }];
}
export function disableToolForAllFiles(files: string[], tool_id: string, timestamp: string) {
    return files.map(file => ({
        apply: (projectPreferences) => {
            initPerTool(projectPreferences, file, tool_id).enabled = false;
            return projectPreferences;
        },
        timestamp
    }));
}


export function addPrToOpenPrsForFile(files: string[], pr_id: number, timestamp: string): UpdatePrefsCommand[] {
    return files.map(file => ({
        apply: (projectPreferences) => {
            projectPreferences.open_prs[file] = projectPreferences.open_prs[file] || [];
            projectPreferences.open_prs[file].push(pr_id);
            return projectPreferences;
        },
        timestamp
    }));
}
