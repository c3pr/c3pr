import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
import {Event} from 'node-c3pr-hub-client';
import handleFirstCollectedEvent from 'node-c3pr-hub-client/events/handleFirstCollectedEvent';
import {c3prRNE} from 'node-c3pr-hub-client/events/registerNewEvent';

import { createGitLabMR } from './createGitLabMR';

import config from '../../config';
import {createAndEmitPullRequestCreated} from "../PullRequestCreated/createAndEmitPullRequestCreated";


export async function handlePullRequestRequested({lcid, euuid}): Promise<any> {
    let handleResult = await handleFirstCollectedEvent({
        event_type: `PullRequestRequested`,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        lcid,
        euuid
    });
    if (handleResult) {
        let {pullRequestRequestedEvent, createMrResult} = handleResult;
        return createAndEmitPullRequestCreated(pullRequestRequestedEvent, createMrResult, {lcid, euuid});
    }
}

async function handlerFunction(pullRequestRequestedEvent: Event<any>, {lcid, euuid}) {

    const prr = pullRequestRequestedEvent.payload;
    const repository = prr.repository;

    c3prLOG4(`Handling MR request title '${prr.pr_title}' rev '${repository.revision}'`, {lcid, euuid, meta: {pullRequestRequestedEvent}});

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
            lcid,
            euuid
        });

        c3prLOG4(`MR created successfully.`, {lcid, euuid, meta: {pullRequestRequestedEvent}});

        return {new_status: 'PROCESSED', result: {pullRequestRequestedEvent, createMrResult}}
    } catch (error) {
        return await emitPullRequestFailed(pullRequestRequestedEvent, error.toString(), lcid, euuid)
    }
}

async function emitPullRequestFailed(pullRequestRequestedEvent, failure_message, lcid, euuid) {
    const pullRequestRequested = pullRequestRequestedEvent.payload;
    const meta = {pullRequestRequestedEvent, failure_message};
    const parent = {event_type: pullRequestRequestedEvent.event_type, uuid: pullRequestRequestedEvent.uuid};

    let result = await c3prRNE.registerNewEvent({
        event_type: `PullRequestFailed`,
        payload: {
            parent,
            changes_committed_root: pullRequestRequested.changes_committed_root,
            repository: pullRequestRequested.repository,
            failure_message
        },
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        lcid,
        euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: PullRequestFailed.`, {lcid, euuid, error, meta});
        return {new_status: 'UNPROCESSED', result: {error, meta}};
    });

    c3prLOG4(`Pull Request creation failed. Reason: ${failure_message}`, {lcid, euuid, meta});
    return {new_status: 'PROCESSED', result};
}