import axios from 'axios';
import config from '../config';

export const fetchProjectFiles = (config) => (axios) =>
    async (changes_committed_root) => {
        const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
        let {data: {payload: {project_uuid}}} = await axios.get(config.c3pr.hub.changesCommittedOfUuidUrl.replace(/:uuid/, changes_committed_root), {headers});
        let {data: projectFiles} = await axios.get(config.c3pr.hub.projectFilesUrl.replace(/:project_uuid/, project_uuid), {headers});
        return projectFiles;
    };


export default fetchProjectFiles(config)(axios);