const config = require('../../config');
const client = require('../../infrastructure/db');

const logs = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoLogsCollection));

async function findBy(query) {
    return (await logs).find(query).toArray();
}

function findAll() {
    return findBy({});
}

async function findNodes() {
    return (await logs).distinct('node');
}

export = {
    findBy,
    findAll,
    findNodes
};