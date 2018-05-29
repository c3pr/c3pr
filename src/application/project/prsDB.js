const client = require('./db');

const prsDB = client.then(cli => cli.db(config.c3pr.brain.c3prBrainMongoDatabase).collection(config.c3pr.brain.c3prBrainMongoCollectionPRs));

async function insert(data) {
    return (await prsDB).insertOne(data);
}

async function findBy(query) {
    return (await prsDB).find(query).toArray();
}

const PR_STATUS = {
    OPEN: 'OPEN',
    MERGED: 'MERGED',
    CLOSED: 'CLOSED'
};

// before creating a TIR, brain must fetch all PRs with OPEN status of that project and remove the changed_files of these PRs from the eligible files
async function newPR({projectUUID, url, ToolInvocationCompleted, changed_files}) {
    return insert(    {
        projectUUID,
        url,
        status: PR_STATUS.OPEN,
        ToolInvocationCompleted,
        changed_files,
        comments_count: {}
    });
}

async function findFilesWithOpenPR(projectUUID) {
    const openPRs = await findBy({projectUUID, status: PR_STATUS.OPEN});
    return openPRs.reduce((changedFiles, openPR) => changedFiles.push(...openPR.changed_files), [])
}

module.exports = {
    newPR,
    findFilesWithOpenPR
};

// noinspection JSUnusedLocalSymbols
const examplePR = [
    {
        projectUUID: "project-uuid-1234-1234",
        url: "https://github.com/c3pr/sample-project-java-maven/pull/23",
        status: "open", //["open", "merged", "closed"]
        ToolInvocationCompleted: "tir-uuid-123-123",
        changed_files: ["..."],
        comments_count: {
            'userone': 12,
            'usertwo': 3
        }
    }
];