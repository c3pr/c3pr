const assert = require('assert');
const client = require('../../infrastructure/db');
const config = require('../../config');

const prsDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoPRsCollection));

async function insert(data) {
    // noinspection JSUnresolvedFunction
    return (await prsDB).insertOne(data);
}

async function findAllOfProject(project_uuid) {
    return (await prsDB).find({project_uuid}).toArray();
}

const PR_STATUS = {
    OPEN: 'open',
    MERGED: 'merged',
    CLOSED: 'closed'
};


async function newPR({project_uuid, pr_id, pr_url, PullRequestRequested, changed_files, assignee}) {
    assert.ok(project_uuid && pr_id && pr_url && PullRequestRequested && changed_files, `Missing required args for newPR(): ${JSON.stringify({project_uuid, pr_id, pr_url, PullRequestRequested, changed_files, assignee})}`);
    return insert({
        project_uuid,
        pr_id,
        pr_url,
        PullRequestRequested,
        changed_files,
        assignee,
        status: PR_STATUS.OPEN,
        comments_count: {}
    });
}

async function updatePR({project_uuid, pr_id, status, assignee}) {
    assert.ok(project_uuid && +pr_id && status, `Missing required args for updatePR(): ${JSON.stringify({project_uuid, pr_id, status, assignee})}`);
    return (await prsDB).update(
        {project_uuid, pr_id: +pr_id},
        {$set: {'status': status, 'assignee': assignee}}
    );
}

export = {
    newPR,
    updatePR,
    findAllOfProject
};