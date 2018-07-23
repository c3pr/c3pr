const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

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

const db = MongoClient.connect(config.c3pr.hub.mongoC3prUrl, {
    useNewUrlParser: true, // https://stackoverflow.com/a/51182415
    // Turn off all buffering, error immediately if disconnected
    bufferMaxEntries: 0,
    autoReconnect: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1500,
    keepAlive: 1
}).catch(e => console.log(`Error on connect()`, e));

/**
 *
 * @type Promise<MongoClient>
 */
module.exports = db.then(client => {
    client.on('close', () => { console.log('-> db lost connection'); });
    client.on('reconnect', () => { console.log('-> db reconnected'); });
    return client;
}).catch(e => console.log(`Error while connecting to C3PR database.`, e));

// https://thecodebarbarian.com/managing-connections-with-the-mongodb-node-driver.html