import axios from 'axios';
import config from '../../config';

export interface ToolAgent {
    tool_id: string;
    extensions: string[];
    tags: string[];
    weight: number;
}

export default async function fetchAllToolAgents(): Promise<ToolAgent[]> {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};

    let {data: toolAgents} = await axios.get(config.c3pr.hub.agentsUrl, {headers});
    return toolAgents;
}
