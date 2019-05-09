import {PartialProjectFile} from "./filterApplicableFiles";
import filterApplicableFiles from "./filterApplicableFiles";

const filterFilesWithExtensions = require('./filterFilesWithExtensions');

type ToolAgent = {tool_id: string, extensions: string[], tags: string[]};

function decideFilesForThisTool(toolAgent: ToolAgent, candidateFiles: string[], projectFilesPreferences: PartialProjectFile[]): string[] {
    const filesThatMatchThisToolsExtensions = filterFilesWithExtensions(candidateFiles, toolAgent.extensions);
    return filterApplicableFiles(toolAgent.tool_id, filesThatMatchThisToolsExtensions.map(f => ({file_path: f})), projectFilesPreferences);
}


export function generateInvocations(filesChangedInThisCommitThatDontHaveOpenPRs: string[],
                                    availableToolsNotYetInvokedForThisCommit: ToolAgent[],
                                    projectFilesPreferences: PartialProjectFile[],
                                    c3prLOG5) {
    let notYetRefactoredFiles = [...filesChangedInThisCommitThatDontHaveOpenPRs];
    let notYetCalledTools = [...availableToolsNotYetInvokedForThisCommit];
    let invocations = [];

    while (notYetRefactoredFiles.length && notYetCalledTools.length) {
        let tool = notYetCalledTools.shift();

        const filesToBeRefactoredNow = decideFilesForThisTool(tool, notYetRefactoredFiles, projectFilesPreferences);

        if (filesToBeRefactoredNow.length) {
            notYetRefactoredFiles = notYetRefactoredFiles.filter(f => !filesToBeRefactoredNow.includes(f));
            invocations.push({tool_id: tool.tool_id, files: filesToBeRefactoredNow});
        }
    }

    if (!notYetRefactoredFiles.length) {
        c3prLOG5(`All files have been handled. Tool invocations complete. Remaining applicable tool agents: ${notYetCalledTools.length}`, {meta: {notYetCalledTools}});
    }
    if (!notYetCalledTools.length) {
        c3prLOG5(`No applicable tools remaining. Tool invocations complete. Remaining changed and not refactored files: ${notYetRefactoredFiles.length}`, {meta: {notYetRefactoredFiles}});
    }

    return invocations;
}