import {ProjectPreferences} from "../preferences/ProjectPreferences";
import shuffleArray from "../../adapters/shuffleArray";
import {extractExtension} from './extractExtensionsInChangeset';
import {ToolAgent} from "./fetchAllToolAgents";


function filterToolsThatSupportExtensionOfFile(tools: ToolAgent[], file: string): ToolAgent[] {
    const extension = extractExtension(file);
    return tools.filter(tool => tool.extensions.includes(extension));
}

function applyProjectWidePreferences(notYetCalledTools, projectPreferences: ProjectPreferences): ToolAgent[] {
    const enabledTools = notYetCalledTools.filter(tool => !projectPreferences.project_wide[tool.tool_id] || projectPreferences.project_wide[tool.tool_id].enabled);
    return enabledTools.map(tool => {
        if (projectPreferences.project_wide[tool.tool_id]) {
            return {...tool, weight: tool.weight += projectPreferences.project_wide[tool.tool_id].weight_modification};
        }
        return tool;
    });
}

function filterToolsNotYetInvoked(availableTools: ToolAgent[], toolsAlreadyInvoked: string[]) {
    return availableTools.filter(tool => !toolsAlreadyInvoked.includes(tool.tool_id));
}

function chooseTool(availableTools: ToolAgent[], toolsAlreadyInvoked: string[] = [], file, c3prLOG5, preferencesForFile = {}) {
    const toolsNotYetInvokedForFileInThisCommit = filterToolsNotYetInvoked(availableTools, toolsAlreadyInvoked);
    const toolsThatSupportThisFilesExtension = filterToolsThatSupportExtensionOfFile(toolsNotYetInvokedForFileInThisCommit, file);

    if (!toolsThatSupportThisFilesExtension.length) {
        c3prLOG5(`No tools available for file ${file}.`, {meta: {file, toolsNotYetInvokedForFileInThisCommit, toolsThatSupportThisFilesExtension}});
        return null;
    }

    let lowestWeight = Number.MAX_SAFE_INTEGER;
    let toolsWithLowestWeightForThisFile: ToolAgent[] = [];
    toolsThatSupportThisFilesExtension.forEach(tool => {
        if (preferencesForFile[tool.tool_id] && preferencesForFile[tool.tool_id].enabled === false) {
            return;
        }
        const toolWeightModForThisFile = preferencesForFile[tool.tool_id] && preferencesForFile[tool.tool_id].weight_modification || 0;
        const toolWeight = tool.weight + toolWeightModForThisFile;

        if (toolWeight < lowestWeight) {
            toolsWithLowestWeightForThisFile = [tool];
            lowestWeight = toolWeight;
        } else if (toolWeight === lowestWeight) {
            toolsWithLowestWeightForThisFile.push(tool);
        }
    });
    return shuffleArray(toolsWithLowestWeightForThisFile)[0].tool_id;
}

function toolsChosenPerFile(filesToAnalyze: string[], availableTools: ToolAgent[], toolsAlreadyInvokedPerFile: { [p: string]: string[] }, projectPreferences: ProjectPreferences, c3prLOG5) {
    const toolsChosen = {};

    filesToAnalyze.forEach(file => {
        const chosenTool = chooseTool(availableTools, toolsAlreadyInvokedPerFile[file], file, c3prLOG5, projectPreferences.per_file[file]);
        if (!chosenTool) return;
        toolsChosen[chosenTool] = toolsChosen[chosenTool] || [];
        toolsChosen[chosenTool].push(file);
    });
    return toolsChosen;
}

function calcFilesWithoutOpenPrs(open_prs: { [p: string]: number[] }, filesToAnalyze: string[]) {
    return filesToAnalyze.filter(f => !open_prs[f] || !open_prs[f].length)
}

export function generateInvocations(projectPreferences: ProjectPreferences,
                                    filesToAnalyze: string[],
                                    availableTools: ToolAgent[],
                                    toolsAlreadyInvokedPerFile: { [file: string]: string[] },
                                    c3prLOG5) {
    const toolsWithWeightAdjustedForProject = applyProjectWidePreferences(availableTools, projectPreferences);

    const filesWithoutOpenPrs = calcFilesWithoutOpenPrs(projectPreferences.open_prs, filesToAnalyze);

    const toolsChosen = toolsChosenPerFile(filesWithoutOpenPrs, toolsWithWeightAdjustedForProject, toolsAlreadyInvokedPerFile, projectPreferences, c3prLOG5);

    const invocations = Object.entries(toolsChosen).map(([tool_id, files]) => ({tool_id, files}));

    if (!invocations.length) {
        c3prLOG5(`Current state generated no invocations. Either all tools have been invoked, disabled or the files already have PRs created. Nothing else to do for this commit.`,
            {meta: {projectPreferences, filesToAnalyze, availableTools, toolsAlreadyInvokedPerFile}});
    }
    return invocations;
}