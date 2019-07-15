import eventsDB from "../events/eventsDB";
import {ProjectPreferences} from "./ProjectPreferences";

const PullRequestUpdatedCommands = {
    OPEN_PULL_REQUEST: 'OPEN_PULL_REQUEST',
    MERGE_PULL_REQUEST: 'MERGE_PULL_REQUEST',
    REOPEN_PULL_REQUEST: 'REOPEN_PULL_REQUEST',
    CLOSE_PULL_REQUEST: 'CLOSE_PULL_REQUEST',
    UPDATE_PULL_REQUEST: 'UPDATE_PULL_REQUEST',
    ADD_COMMENT: 'ADD_COMMENT'
};
type PRStatus = 'open' | 'closed' | 'merged';


async function processComment(clone_url_http: string, pr_id: number, text: string): Promise<UpdatePresCommand[]> {
    const commands: UpdatePresCommand[] = [];
    let files: string[] = await filesForPR(clone_url_http, pr_id);
    // TODO
    // if text mentions bot..
    // process command
    return commands;
}


async function filesForPR(clone_url_http: string, pr_id: number) {
    const prc = await eventsDB.findAll({event_type: 'PullRequestCreated', 'payload.pr_id': pr_id})[0];
    // TODO
    const prr = 0 // prc.parent.uuid type=PRR
    const tic = 0 // prr.parent.uuid type=TIC
    return tic.payload.changed_files;
}

function reasonMessage(pr_id: number) {
    return `PR of id ${pr_id} is open.`;
}

async function disableAllToolsForAllFilesChangedInPR(clone_url_http: string, pr_id: number): Promise<UpdatePresCommand[]> {
    const commands: UpdatePresCommand[] = [];
    let files: string[] = await filesForPR(clone_url_http, pr_id);
    for (const file of files) {
        commands.push({
            apply: (projectPreferences) => { projectPreferences.per_file[file].all_tools = {enabled: false, reason: reasonMessage(pr_id)}; return projectPreferences; },
            timestamp: '?'
        })
    }
    return commands;
}

/**
 * Note: There can be a rare situation:
 * - c3pr creates PR 1 on file X
 * - someone closes PR 1
 * - c3pr creates PR 2 on file X (because PR 1 was closed)
 * - someone opens PR 1
 * - someone closes PR 1
 * At this point, C3PR may create new PRs, even though PR 2 is still open.
 *
 * Because it is so rare, and the impact is rather small (a second PR on a file) we chose not to handle it right now,
 * as it had the potential to complicate the current code a lot.
 */
async function removeDisableAllToolsForAllFilesChangedInPR(clone_url_http: string, pr_id: number): Promise<UpdatePresCommand[]> {
    const commands: UpdatePresCommand[] = [];
    let files: string[] = await filesForPR(clone_url_http, pr_id);
    for (const file of files) {
        commands.push({
            apply: (projectPreferences) => { delete projectPreferences.per_file[file].all_tools; return projectPreferences; },
            timestamp: '?'
        })
    }
    return commands;
}

interface UpdatePresCommand {
    apply: (projectPreferences: ProjectPreferences) => ProjectPreferences;
    timestamp: string;
}


export default async function calculatePreferencesFromPRUs(clone_url_http: string): Promise<UpdatePresCommand[]> {
    const prus = await eventsDB.findAll({event_type: 'PullRequestUpdated', 'payload.repository.clone_url_http': clone_url_http});

    const commands: UpdatePresCommand[] = [];

    for (const {payload: {pr_id, status, command, args}} of prus) {

        if (command === PullRequestUpdatedCommands.ADD_COMMENT) {
            commands.push(...(await processComment(clone_url_http, args.pr_id, args.text)));
        } else {
            if (status as PRStatus === 'open') {
                commands.push(...(await disableAllToolsForAllFilesChangedInPR(clone_url_http, pr_id)));
            } else {
                commands.push(...(await removeDisableAllToolsForAllFilesChangedInPR(clone_url_http, pr_id)));
            }
        }
    }

    return commands;
}