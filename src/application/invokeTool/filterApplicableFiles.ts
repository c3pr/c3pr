import {ExcludedForTool, LineInterval} from "../../adapters/fetchProjectFiles";

export interface PartialProjectFile {
    file_path: string;
    excluded_for_tools: ExcludedForTool[];
}
interface ChangedFile {
    file_path: string;
    changed_line_intervals: LineInterval[]; // TODO at the moment we ignore lines... see code below
}


export default function filterApplicableFiles(toolName: string, changedFiles: ChangedFile[], projectFiles: PartialProjectFile[]): string[] {
    // @ts-ignore
    const projectFilesMap = new Map(projectFiles.map(pf => [pf.file_path, pf.excluded_for_tools]));

    return changedFiles
        .map(({file_path}) => ({file_path, excludedForTools: projectFilesMap.get(file_path)}))
        .filter(({excludedForTools}) => !excludedForTools || !excludedForTools.some(eft => eft.all_tools || eft.tool_name === toolName))
        .map(({file_path}) => file_path);
}