import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import {Event} from 'node-c3pr-hub-client';
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';

import { createGitLabMR } from './createGitLabMR';

import config from '../../config';
import {createAndEmitPullRequestCreated} from "../PullRequestCreated/createAndEmitPullRequestCreated";


export async function handlePullRequestRequested({lcid, sha, euuid}): Promise<any> {
    let handleResult = await handleFirstCollectedEvent({
        event_type: `PullRequestRequested`,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        lcid, sha, euuid
    });
    if (handleResult) {
        let {pullRequestRequestedEvent, createMrResult} = handleResult;
        return createAndEmitPullRequestCreated(pullRequestRequestedEvent, createMrResult, {lcid, sha, euuid});
    }
}

async function handlerFunction(pullRequestRequestedEvent: Event<any>, {lcid, sha, euuid}): Promise<any> {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid});
    const prr = pullRequestRequestedEvent.payload;
    const repository = prr.repository;

    _c3prLOG5(`Handling MR request title '${prr.pr_title}' rev '${repository.revision}'`, {meta: {pullRequestRequestedEvent}});

    try {
        let createMrResult = await createGitLabMR({
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
            patchHexBase64: prr.diff_base64,
            lcid, sha, euuid
        });

        _c3prLOG5(`MR created successfully.`, {meta: {pullRequestRequestedEvent}});

        return {new_status: 'PROCESSED', result: {pullRequestRequestedEvent, createMrResult}}
    } catch (error) {
        return await emitPullRequestFailed(pullRequestRequestedEvent, error.toString(), _c3prLOG5)
    }
}

async function emitPullRequestFailed(pullRequestRequestedEvent, failure_message, _c3prLOG5): Promise<{new_status, result}> {
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
            _c3prLOG5
        );
        _c3prLOG5(`Pull Request creation failed. Reason: ${failure_message}`, {meta});
        return {new_status: 'PROCESSED', result};
    } catch (error) {
        _c3prLOG5(`Error while registering new event: PullRequestFailed.`, {error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    }

}