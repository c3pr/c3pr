const client = require('./db');

const prs = client.then(cli => cli.db(config.c3pr.brain.c3prBrainMongoDatabase).collection(config.c3pr.brain.c3prBrainMongoCollectionPRs));

async function insert(data) {
    return (await prs).insertOne(data);
}

async function findBy(query) {
    return (await prs).find(query).toArray();
}

const PR_STATUS = {
    OPEN: 'OPEN',
    MERGED: 'MERGED',
    CLOSED: 'CLOSED'
};

// before creating a TIR, brain must fetch all PRs with OPEN status of that project and remove the changed_files of these PRs from the eligible files
async function newPR({project, url, ToolInvocationRequested, changed_files}) {
    return insert(    {
        project,
        url,
        status: PR_STATUS.OPEN,
        ToolInvocationRequested,
        changed_files,
        comments_count: {}
    });
}

module.exports = {
    newPR
};

// noinspection JSUnusedLocalSymbols
const examplePR = [
    {
        project: "project-uuid-1234-1234",
        url: "https://github.com/c3pr/sample-project-java-maven/pull/23",
        status: "open", //["open", "merged", "closed"]
        ToolInvocationRequested: "tir-uuid-123-123",
        changed_files: ["..."],
        comments_count: {
            'userone': 12,
            'usertwo': 3
        }
    }
];