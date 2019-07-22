import eventsDB from "../events/eventsDB";
import {
    UpdatePrefsCommand,
    WEIGHT_MODIFICATION_PER_CLOSED_PR,
    WEIGHT_MODIFICATION_PER_MERGED_PR
} from "./ProjectPreferences";
import {
    addPrToOpenPrsForFile,
    modifyWeightOfToolForAllFiles,
    removePrFromOpenPrsForFile
} from "./mappers";
import filesAndToolForPR from "./filesAndToolForPr";
import {generateCommandsFromComment} from "../comments/processComment";

const PullRequestUpdatedCommands = {
    OPEN_PULL_REQUEST: 'OPEN_PULL_REQUEST',
    MERGE_PULL_REQUEST: 'MERGE_PULL_REQUEST',
    REOPEN_PULL_REQUEST: 'REOPEN_PULL_REQUEST',
    CLOSE_PULL_REQUEST: 'CLOSE_PULL_REQUEST',
    UPDATE_PULL_REQUEST: 'UPDATE_PULL_REQUEST',
    ADD_COMMENT: 'ADD_COMMENT'
};
type PRStatus = 'open' | 'closed' | 'merged';


async function handlePRU(command: any, clone_url_http: string, args: any, commands: UpdatePrefsCommand[], created: any, pr_id: any, status: any) {
    if (command === PullRequestUpdatedCommands.ADD_COMMENT) {
        let filesAndTool = await filesAndToolForPR(clone_url_http, args.pr_id);
        return generateCommandsFromComment(filesAndTool.changed_files, filesAndTool.tool_id, created, args.text);
    } else {
        let filesAndTool = await filesAndToolForPR(clone_url_http, pr_id);
        const s = status as PRStatus;
        if (s === 'open') {
            return addPrToOpenPrsForFile(filesAndTool.changed_files, pr_id, created);
        } else {
            const commands: UpdatePrefsCommand[] = removePrFromOpenPrsForFile(filesAndTool.changed_files, pr_id, created);
            if (s === 'merged') {
                // increase weight
                commands.push(...modifyWeightOfToolForAllFiles(filesAndTool.changed_files, filesAndTool.tool_id, created, WEIGHT_MODIFICATION_PER_MERGED_PR));
            } else { // 'closed' - decrease weight
                commands.push(...modifyWeightOfToolForAllFiles(filesAndTool.changed_files, filesAndTool.tool_id, created, WEIGHT_MODIFICATION_PER_CLOSED_PR));
            }
            return commands;
        }
    }
}

export default async function genPrefsFromPRUs(clone_url_http: string): Promise<UpdatePrefsCommand[]> {
    const prus = await eventsDB.findAll({event_type: 'PullRequestUpdated', 'payload.repository.clone_url_http': clone_url_http});
    const commands: UpdatePrefsCommand[] = [];
    for (const {meta: {created}, payload: {pr_id, status, command, args}} of prus) {
        commands.push(...await handlePRU(command, clone_url_http, args, commands, created, pr_id, status));
    }
    return commands;
}

