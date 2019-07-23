import eventsDB from "../events/eventsDB";

interface FilesAndTool { changed_files: string[]; tool_id: string; }
export default async function filesAndToolForPR(clone_url_http: string, pr_id: number): Promise<FilesAndTool> {
    const prc = (await eventsDB.findAll({event_type: 'PullRequestCreated', 'payload.repository.clone_url_http': clone_url_http, 'payload.pr_id': pr_id}))[0];
    if (!prc) {
        return {changed_files: [], tool_id: `PRC not found: ${clone_url_http} #${pr_id}`};
    }
    const prr = await eventsDB.find(prc.payload.parent.uuid);
    const tic = await eventsDB.find(prr.payload.parent.uuid);
    const tir = await eventsDB.find(tic.payload.parent.uuid);
    return {changed_files: tic.payload.changed_files, tool_id: tir.payload.tool_id};
}