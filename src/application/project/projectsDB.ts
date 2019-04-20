const uuidv4 = require('uuid/v4');
const assert = require('assert');

const config = require('../../config');
const client = require('../../infrastructure/db');

const projects = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoProjectsCollection));

async function insert(data) {
    return (await projects).insertOne(data);
}

async function findBy(query) {
    return (await projects).find(query).toArray();
}

async function projectDoesNotExist(query) {
    return !(await (await projects).find(query).toArray()).length;
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

function removeEmptyProperties(myObj) {
    const clone = {... myObj};
    Object.keys(clone).forEach((key) => (myObj[key] === null || myObj[key] === undefined) && delete myObj[key]);
    return clone;
}

async function updateProject({uuid, clone_url_http, name, tags}) {
    assert.ok(uuid, `Missing uuid for updateProject()!`);
    return (await projects).update(
        {uuid},
        {$set: removeEmptyProperties({clone_url_http, name, tags})}
    );
}

export default {
    newProject,
    updateProject,
    findBy,
    findAll,
    projectDoesNotExist
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