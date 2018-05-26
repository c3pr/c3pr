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

/**
 *
 * @type Promise<MongoClient>
 */
module.exports = MongoClient.connect(config.c3pr.brain.c3prBrainMongoUrl, {});