import eventsDB from "../events/eventsDB";
import {UpdatePresCommand} from "./ProjectPreferences";
import {addPrToOpenPrsForFile} from "./mappers";
import filesAndToolForPR from "./filesAndToolForPr";

export default async function genPrefsFromPRCs(clone_url_http: string): Promise<UpdatePresCommand[]> {
    const prcs = await eventsDB.findAll({event_type: 'PullRequestCreated', 'payload.repository.clone_url_http': clone_url_http});
    const commands: UpdatePresCommand[] = [];
    for (const {meta: {created}, payload: {pr_id}} of prcs) {
        let filesAndTool = await filesAndToolForPR(clone_url_http, pr_id);
        commands.push(...addPrToOpenPrsForFile(filesAndTool.changed_files, pr_id, created));
    }
    return commands;
}