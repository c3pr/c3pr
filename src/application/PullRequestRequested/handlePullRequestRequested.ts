import {Event} from 'node-c3pr-hub-client';
import handleEventById from 'node-c3pr-hub-client/events/handleEventById';
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';

import { createGitLabMR } from './createGitLabMR';

import config from '../../config';
import {createAndEmitPullRequestCreated} from "../PullRequestCreated/createAndEmitPullRequestCreated";


export async function handlePullRequestRequested(request, c3prLOG5): Promise<any> {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestRequested'});

    let handleResult = handleEventById({
        event_uuid: request.body.uuid,
        handlerFunction: handlerFunction as any,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
    }, c3prLOG5);

    if (handleResult) {
        let {pullRequestRequestedEvent, createMrResult} = handleResult as any;
        return createAndEmitPullRequestCreated(pullRequestRequestedEvent, createMrResult, c3prLOG5);
    }
}

async function handlerFunction(pullRequestRequestedEvent: Event<any>, c3prLOG5): Promise<any> {
    c3prLOG5 = c3prLOG5({caller_name: 'handlePullRequestRequested#hf'});

    const prr = pullRequestRequestedEvent.payload;
    const repository = prr.repository;

    c3prLOG5(`Handling MR request title '${prr.pr_title}' rev '${repository.revision}'`, {meta: {pullRequestRequestedEvent}});

    try {
        let createMrResult = await createGitLabMR(
            {
                mainRepoOrgRepo: repository.full_path,
                mainRepoBranch: repository.branch,
                mainRepoHash: repository.revision,
                gitLabUrl: config.c3pr.repoGitlab.gitlab.url,
                gitLabApiToken: config.c3pr.repoGitlab.gitlab.apiToken,
                gitUserName: config.c3pr.repoGitlab.gitlab.botUserName,
                gitUserEmail: config.c3pr.repoGitlab.gitlab.botUserEmail,
                pr_assignee: prr.assignee,
                pr_title: prr.pr_title,
                pr_body: prr.pr_body,
                patchHexBase64: prr.diff_base64
            },
            c3prLOG5
        );

        c3prLOG5(`MR created successfully.`, {meta: {pullRequestRequestedEvent}});

        return {new_status: 'PROCESSED', result: {pullRequestRequestedEvent, createMrResult}}
    } catch (error) {
        return await emitPullRequestFailed(pullRequestRequestedEvent, error.toString(), c3prLOG5)
    }
}

async function emitPullRequestFailed(pullRequestRequestedEvent, failure_message, c3prLOG5): Promise<{new_status, result}> {
    const pullRequestRequested = pullRequestRequestedEvent.payload;
    const meta = {pullRequestRequestedEvent, failure_message};
    const parent = {event_type: pullRequestRequestedEvent.event_type, uuid: pullRequestRequestedEvent.uuid};

    try {
        let result = await c3prHubRegisterNewEvent(
            {
                event_type: `PullRequestFailed`,
                payload: {
                    parent,
                    changes_committed_root: pullRequestRequested.changes_committed_root,
                    repository: pullRequestRequested.repository,
                    failure_message
                },
                c3prHubUrl: config.c3pr.hub.c3prHubUrl,
                jwt: config.c3pr.hub.auth.jwt
            },
            c3prLOG5
        );
        c3prLOG5(`Pull Request creation failed. Reason: ${failure_message}`, {meta});
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        c3prLOG5(`Error while registering new event: PullRequestFailed.`, {error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    }

}