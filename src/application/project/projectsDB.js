const uuidv4 = require('uuid/v4');

const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

/*
// http://mongodb.github.io/node-mongodb-native/3.0/api/Server.html
export interface SocketOptions {
    // Reconnect on error. default:false
    autoReconnect?: boolean;
    // TCP Socket NoDelay option. default:true
    noDelay?: boolean;
    // TCP KeepAlive on the socket with a X ms delay before start. default:0
    keepAlive?: number;
    // TCP Connection timeout setting. default 0
    connectTimeoutMS?: number;
    // TCP Socket timeout setting. default 0
    socketTimeoutMS?: number;
}
*/
const client = MongoClient.connect(config.c3pr.brain.c3prBrainMongoUrl, {});

const projects = client.then(cli => cli.db(config.c3pr.brain.c3prBrainMongoDatabase).collection(config.c3pr.brain.c3prBrainMongoCollectionProjects));

async function insert(data) {
    return (await projects).insertOne(data);
}

async function findBy(query) {
    return (await projects).find(query).toArray();
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
    });
}

module.exports = {
    newProject
};

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

// na hora de fazer um TIR, ele tem que listar todas as PRs com status "open" daquele projeto e remover os changed_files delas da lista de possiveis
const prs = [
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