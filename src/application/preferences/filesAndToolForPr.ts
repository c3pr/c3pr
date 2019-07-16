import eventsDB from "../events/eventsDB";

interface FilesAndTool { changed_files: string[]; tool_id: string; }
export default async function filesAndToolForPR(clone_url_http: string, pr_id: number): Promise<FilesAndTool> {
    const prc = await eventsDB.findAll({event_type: 'PullRequestCreated', 'payload.repository.clone_url_http': clone_url_http, 'payload.pr_id': pr_id})[0];
    const prr = await eventsDB.findAll({event_type: 'PullRequestRequested', uuid: prc.payload.parent.uuid})[0];
    const tic = eventsDB.findAll({event_type: 'ToolInvocationCompleted', uuid: prr.payload.parent.uuid})[0];
    const tir = await eventsDB.findAll({event_type: 'ToolInvocationRequested', uuid: tic.payload.parent.uuid})[0];
    return {changed_files: tic.payload.changed_files, tool_id: tir.payload.tool_id};
}