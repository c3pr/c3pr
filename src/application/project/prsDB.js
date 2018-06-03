const assert = require('assert');
const client = require('./db');
const config = require('../../config');

const prsDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoPRsCollection));

async function insert(data) {
    // noinspection JSUnresolvedFunction
    return (await prsDB).insertOne(data);
}

async function findBy(query) {
    return (await prsDB).find(query).toArray();
}

async function findAllOfProject(processor_uuid) {
    return (await prsDB).find({processor_uuid}).toArray();
}

const PR_STATUS = {
    OPEN: 'OPEN',
    MERGED: 'MERGED',
    CLOSED: 'CLOSED'
};


// before creating a TIR, brain must fetch all PRs with OPEN status of that project and remove the changed_files of these PRs from the eligible files
async function newPR({project_uuid, pr_id, pr_url, PullRequestRequested, changed_files}) {
    assert.ok(project_uuid && pr_id && pr_url && PullRequestRequested && changed_files, "Missing required args.");
    return insert({
        project_uuid,
        pr_id,
        pr_url,
        PullRequestRequested,
        changed_files,
        status: PR_STATUS.OPEN,
        comments_count: {}
    });
}

async function findFilesWithOpenPR(project_uuid) {
    const openPRs = await findBy({project_uuid, status: PR_STATUS.OPEN});
    return openPRs.reduce((changedFiles, openPR) => [...changedFiles, ...openPR.changed_files], [])
}

module.exports = {
    newPR,
    findAllOfProject,
    findFilesWithOpenPR
};