const client = require('./db');
const config = require('../../config');

const prsDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoPRsCollection));

async function insert(data) {
    return (await prsDB).insertOne(data);
}

async function findBy(query) {
    return (await prsDB).find(query).toArray();
}

async function findAllOfProject(projectUUID) {
    return (await prsDB).find({projectUUID}).toArray();
}

const PR_STATUS = {
    OPEN: 'OPEN',
    MERGED: 'MERGED',
    CLOSED: 'CLOSED'
};

// before creating a TIR, brain must fetch all PRs with OPEN status of that project and remove the changed_files of these PRs from the eligible files
async function newPR({projectUUID, url, PullRequestRequested, changed_files}) {
    return insert(    {
        projectUUID,
        url,
        status: PR_STATUS.OPEN,
        PullRequestRequested,
        changed_files,
        comments_count: {}
    });
}

async function findFilesWithOpenPR(projectUUID) {
    const openPRs = await findBy({projectUUID, status: PR_STATUS.OPEN});
    return openPRs.reduce((changedFiles, openPR) => [...changedFiles, ...openPR.changed_files], [])
}

module.exports = {
    newPR,
    findAllOfProject,
    findFilesWithOpenPR
};


// noinspection BadExpressionStatementJS
(() => {
    const examplePRCreated = {
        // project_uuid
        parent: {
            event_type: "PullRequestRequested",
            uuid: pullRequestRequestedEvent.uuid
        },
        repository: pullRequestRequestedEvent.payload.repository,
        pr_id: 123,
        pr_url: createMrResult.web_url, // "https://github.com/c3pr/sample-project-java-maven/pull/23",
        // changed_files,
        //status: 'OPEN',
        //PullRequestRequested: ,
        //comments_count: {}
    };
    // noinspection JSUnusedLocalSymbols
    const examplePR = [
        {
            projectUUID: "project-uuid-1234-1234",
            url: "https://github.com/c3pr/sample-project-java-maven/pull/23",
            status: 'OPEN', //['OPEN', 'MERGED', 'CLOSED']
            PullRequestRequested: "tir-uuid-123-123",
            changed_files: ["..."],
            comments_count: {
                'userone': 12,
                'usertwo': 3
            }
        }
    ];

    // noinspection JSIgnoredPromiseFromCall
    newPR({projectUUID: "7ac33816-c794-4cf3-a5b4-5f7e2ff06543", url: "http://example.com/starwars/c-3po-project/pull/1", PullRequestRequested: "...", changed_files: ["a1.txt"]});
    // noinspection JSIgnoredPromiseFromCall
    newPR({projectUUID: "7ac33816-c794-4cf3-a5b4-5f7e2ff06543", url: "http://example.com/starwars/c-3po-project/pull/2", PullRequestRequested: "...", changed_files: ["a2.txt"]}); //later status:merged
    // noinspection JSIgnoredPromiseFromCall
    newPR({projectUUID: "7ac33816-c794-4cf3-a5b4-5f7e2ff06543", url: "http://example.com/starwars/c-3po-project/pull/3", PullRequestRequested: "...", changed_files: ["a3.txt"]}); //later status:closed
});
