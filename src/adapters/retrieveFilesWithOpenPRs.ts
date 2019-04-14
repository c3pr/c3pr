const axios = require('axios').default;
const config = require('../config');

/**
 * Returns all files with an open PR that was created by the bot.
 */
async function retrieveFilesWithOpenPRs(changes_committed_root) {
    const headers = {Authorization: `Bearer ${config.c3pr.auth.jwt}`};
    let {data: {payload: {project_uuid}}} = await axios.get(config.c3pr.hub.changesCommittedOfUuidUrl.replace(/:uuid/, changes_committed_root), {headers});
    let {data: filesWithOpenPRs} = await axios.get(config.c3pr.hub.filesWithOpenPRsForProjectUrl.replace(/:project_uuid/, project_uuid), {headers});
    return filesWithOpenPRs;
}

export = retrieveFilesWithOpenPRs;