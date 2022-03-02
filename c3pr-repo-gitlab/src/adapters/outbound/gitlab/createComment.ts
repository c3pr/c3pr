import axios from 'axios';

import config from '../../../config';
import {getGitLabProject} from "./getGitLabProject";


export async function createComment(mainRepoOrgRepo, mergeRequestIid, commentTextMarkdown, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'createComment'});

    c3prLOG5(`Commenting MR.`, {meta: {mainRepoOrgRepo, mergeRequestIid, commentTextMarkdown}});

    let {id: mainRepoId} = await getGitLabProject(mainRepoOrgRepo);

    let {data: commentCreation} = await axios.post(
        `${config.c3pr.repoGitlab.gitlab.url}/api/v4/projects/${mainRepoId}/merge_requests/${mergeRequestIid}/notes`,
        {body: commentTextMarkdown},
        {headers: {"PRIVATE-TOKEN": config.c3pr.repoGitlab.gitlab.apiToken}}
    );

    return commentCreation;
}
