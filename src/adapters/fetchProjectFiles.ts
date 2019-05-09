import axios from 'axios';
import config from '../config';

export interface LineInterval {
    start: number;
    end: number;
}
export interface ProjectFile {
    project_uuid: string;
    file_path: string;
    analyses: [
        {tool_name: string, lines: LineInterval[], date_time: string}
        ],
    excluded_for_tools:
        ({all_tools: boolean, all_lines: boolean,    reason?: string} |
            {all_tools: boolean, lines: LineInterval[], reason?: string} |
            {tool_name: string,  all_lines: boolean,    reason?: string} |
            {tool_name: string,  lines: LineInterval[], reason?: string})[]
    ;
}

export const fetchProjectFiles = (config) => (axios) =>
    async (changes_committed_root): Promise<ProjectFile[]> => {
        const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
        let {data: {payload: {project_uuid}}} = await axios.get(config.c3pr.hub.changesCommittedOfUuidUrl.replace(/:uuid/, changes_committed_root), {headers});
        let {data: projectFiles} = await axios.get(config.c3pr.hub.projectFilesUrl.replace(/:project_uuid/, project_uuid), {headers});
        return projectFiles;
    };


export default fetchProjectFiles(config)(axios);