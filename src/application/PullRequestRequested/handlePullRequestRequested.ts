import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";
import {Event} from 'node-c3pr-hub-client';
import hfce = require('node-c3pr-hub-client/events/handleFirstCollectedEvent');

let handleFirstCollectedEvent = hfce.handleFirstCollectedEvent.handleFirstCollectedEvent;

import { createGitLabMR } from '../pr/createGitLabMR';

import config from '../../config';
import {createAndEmitPullRequestCreated} from "../PullRequestCreated/createAndEmitPullRequestCreated";
import {InboundPorts} from "../../ports/inbound/InboundPorts";

const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'handlePullRequestRequested'}];
const logMetaz = (correlationId) => [{nodeName: 'c3pr-repo-gitlab', correlationId, moduleName: 'handlePullRequestRequested'}];


async function handlePullRequestRequested(): Promise<any> {
    let {pullRequestRequestedEvent, createMrResult} = await handleFirstCollectedEvent({
        event_type: `PullRequestRequested`,
        handlerFunction,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.hub.auth.jwt,
        logMetas
    });
    return createAndEmitPullRequestCreated(pullRequestRequestedEvent, createMrResult);
}

async function handlerFunction(pullRequestRequestedEvent: Event<any>) {

    const prr = pullRequestRequestedEvent.payload;
    const repository = prr.repository;

    c3prLOG2({
        msg: `Handling MR request title '${prr.pr_title}' rev '${repository.revision}'`,
        logMetas: logMetaz(repository.revision),
        meta: {pullRequestRequestedEvent}
    });

    /** @namespace repository.full_path */
    /** @namespace prr.pr_body */
    /** @namespace prr.diff_base64 */
    /** @namespace prr.pr_title */
    let createMrResult = await createGitLabMR({
        mainRepoOrgRepo: repository.full_path,
        mainRepoBranch: repository.branch,
        mainRepoHash: repository.revision,
        gitLabUrl: config.c3pr.repoGitlab.gitlab.url,
        gitLabApiToken: config.c3pr.repoGitlab.gitlab.apiToken,
        gitUserName: config.c3pr.repoGitlab.gitlab.botUserName,
        gitUserEmail: config.c3pr.repoGitlab.gitlab.botUserEmail,
        prCommitMessage: prr.pr_title,
        pr_assignee: prr.assignee,
        prTitle: prr.pr_title,
        prBody: prr.pr_body,
        patchContent: prr.diff_base64
    });

    c3prLOG2({
        msg: `MR created successfully.`,
        logMetas: logMetaz(repository.revision),
        meta: {pullRequestRequestedEvent}
    });

    return {new_status: 'PROCESSED', result: {pullRequestRequestedEvent, createMrResult}}
}


// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: InboundPorts['handlePullRequestRequested'] = handlePullRequestRequested;
export { handlePullRequestRequested };