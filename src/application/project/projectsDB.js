const uuidv4 = require('uuid/v4');

const config = require('../../config');
const client = require('./db');

const projects = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoProjectsCollection));

async function insert(data) {
    return (await projects).insertOne(data);
}

async function findBy(query) {
    return (await projects).find(query).toArray();
}

function findAll() {
    return findBy({});
}

async function newProject({clone_url_http, name, tags}) {
    const projectOfUrl = await findBy({clone_url_http});
    if (projectOfUrl.length > 0) {
        throw new Error(`A project with URL ${clone_url_http} already exists. UUID: ${projectOfUrl[0].uuid}.`);
    }

    return insert({
        uuid: uuidv4(),
        clone_url_http,
        name,
        tags,
        should_analyze_pushes: true, // should analyze regular pushes/commits (Not just PRs)
        should_analyze_prs: true
    });
}

module.exports = {
    newProject,
    findBy,
    findAll
};

// noinspection BadExpressionStatementJS
(() => {

newProject({
    clone_url_http: "https://gitlab.com/c3pr/sample-project-java-maven.git",
    name: 'sample-project-java-maven',
    tags: ["java", "maven"],
}).catch(console.log);
newProject({
    clone_url_http: "http://c3prgitlab:8888/sample_user/sample-project-java-maven.git",
    name: 'sample-project-java-maven',
    tags: ["java", "maven"],
}).catch(console.log);

});