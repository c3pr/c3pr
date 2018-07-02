const config = require('../../config');
const client = require('../../infrastructure/db');

const projects = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoLogsCollection));

async function findBy(query) {
    return (await projects).find(query).toArray();
}

function findAll() {
    return findBy({});
}

async function findNodes() {
    return (await projects).distinct('node');
}

module.exports = {
    findBy,
    findAll,
    findNodes
};