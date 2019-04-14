const axios = require('axios').default;
const config = require('../config');

async function fetchBlacklistedFiles(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: {payload: {project_uuid}}} = await axios.get(config.c3pr.hub.changesCommittedOfUuidUrl.replace(/:uuid/, changes_committed_root), {headers});
    let {data: blackListedFiles} = await axios.get(config.c3pr.hub.blackListedFilesForProjectUrl.replace(/:project_uuid/, project_uuid), {headers});
    return blackListedFiles;
}

export default fetchBlacklistedFiles;