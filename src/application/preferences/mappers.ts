import {initPerTool, UpdatePresCommand} from "./ProjectPreferences";

export function modifyWeightOfToolForAllFiles(files: string[], tool_id: string, timestamp: string, weight_modification: number): UpdatePresCommand[] {
    const commands: UpdatePresCommand[] = [];
    for (const file of files) {
        commands.push({
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
        })
    }
    return commands;
}

export function removePrFromOpenPrsForFile(files: string[], pr_id: number, timestamp: string): UpdatePresCommand[] {
    const commands: UpdatePresCommand[] = [];
    for (const file of files) {
        commands.push({
            apply: (projectPreferences) => {
                projectPreferences.open_prs[file] = projectPreferences.open_prs[file] || [];
                projectPreferences.open_prs[file] = projectPreferences.open_prs[file].filter(pid => pid !== pr_id);
                if (!projectPreferences.open_prs[file].length) delete projectPreferences.open_prs[file];
                return projectPreferences;
            },
            timestamp
        })
    }
    return commands;
}


export function disableToolForAllChangedFiles(files: string[], tool_id: string, timestamp: string) {
    const commands: UpdatePresCommand[] = [];
    for (const file of files) {
        commands.push({
            apply: (projectPreferences) => {
                initPerTool(projectPreferences, file, tool_id).enabled = false;
                return projectPreferences;
            },
            timestamp
        })
    }
    return commands;
}



export function addPrToOpenPrsForFile(files: string[], pr_id: number, timestamp: string): UpdatePresCommand[] {
    const commands: UpdatePresCommand[] = [];
    for (const file of files) {
        commands.push({
            apply: (projectPreferences) => {
                projectPreferences.open_prs[file] = projectPreferences.open_prs[file] || [];
                projectPreferences.open_prs[file].push(pr_id);
                return projectPreferences;
            },
            timestamp
        })
    }
    return commands;
}